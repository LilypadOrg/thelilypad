import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { Session } from 'next-auth';
import { MAIN_CONTRACT_ABI, MAIN_CONTRACT_ADDRESS } from '~/utils/contracts';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';

export const CompleteCourse = ({
  user,
  courseId,
  completed,
}: {
  user: Session['user'];
  courseId: number;
  completed: boolean;
}) => {
  const utils = trpc.useContext();

  const { data: onChainProfile } = useContractRead({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'getMember',
    args: [user.address],
  });

  const { data: completeEventSignature } = trpc.useQuery(
    [
      'blockend.signCompleteEvent',
      {
        address: user.address,
        courseId: courseId,
      },
    ],
    {
      enabled: !!onChainProfile?.pathChosen && !completed,
    }
  );

  const { config: completeCourseConfig } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'completeEvent',
    args: [user.address, courseId, completeEventSignature],
    enabled: !!completeEventSignature,
  });

  const refreshUserStats = trpc.useMutation(['users.updateXPandLevel'], {
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      utils.invalidateQueries(['users.byAddress', { address: user.address }]);
    },
  });

  const mutateCompleted = trpc.useMutation(['usercourses.complete'], {
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      utils.invalidateQueries(['courses.byId', { id: courseId }]);
      utils.invalidateQueries(['usercourses.all', { userId: user.userId }]);
    },
  });

  const setCompleted = async () => {
    await mutateCompleted.mutateAsync({
      courseId: courseId,
      completed: true,
    });
    refreshUserStats.mutate();
  };

  const { data: completeCourseRes, write: completeCourse } =
    useContractWrite(completeCourseConfig);

  const { isLoading: isLoadingCompleteCourse } = useWaitForTransaction({
    hash: completeCourseRes?.hash,
    onSuccess: () => {
      setCompleted();
    },
  });

  const handleSetCompleted = async () => {
    console.log('handler called');
    if (completeCourse) {
      completeCourse();
    } else {
      setCompleted();
    }
  };

  return (
    <div>
      <button
        disabled={isLoadingCompleteCourse || completed}
        onClick={handleSetCompleted}
        className="mt-8 w-full rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
      >
        {isLoadingCompleteCourse && 'Loading...'}
        {completed &&
          `Course completed',
            {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }
          )}
        `}
        {!isLoadingCompleteCourse && !completed && 'Mark as complete'}
      </button>
    </div>
  );
};
