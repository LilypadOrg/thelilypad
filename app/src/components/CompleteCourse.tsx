import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { Session } from 'next-auth';
import { MAIN_CONTRACT_ABI, MAIN_CONTRACT_ADDRESS } from '~/utils/contracts';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';
import { useOnChainProfile } from '~/hooks/useOnChainProfile';

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

  const { data: onChainProfile } = useOnChainProfile(user?.address);

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

  // const { mutate: refreshUserStats, isLoading: isLoadingrefreshUserStats } =
  //   trpc.useMutation(['users.updateXPandLevel'], {
  //     onError: (err) => {
  //       toast.error(err.message);
  //     },
  //     onSuccess: () => {
  //       console.log('user stats updated. invalidating user.byAddress....');
  //     },
  //   });

  const { mutate: mutateCompleted, isLoading: isLoadingMutateCompleted } =
    trpc.useMutation(['usercourses.complete'], {
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: () => {
        utils.refetchQueries(['usercourses.all', { userId: user.userId }]);
        utils.refetchQueries(['usercourses.single', { courseId }]);
        setTimeout(() => {
          utils.refetchQueries(['users.byAddress', { address: user.address }]);
        }, 5000);
      },
    });

  const setCompleted = async () => {
    mutateCompleted({
      courseId: courseId,
    });
    // refreshUserStats();
  };

  const { data: completeCourseRes, write: completeCourse } =
    useContractWrite(completeCourseConfig);

  const { isLoading: isLoadingCompleteCourse } = useWaitForTransaction({
    hash: completeCourseRes?.hash,
    onSuccess: (data) => {
      console.log('contract tx completed');
      console.log(data);
      setCompleted();
    },
  });

  const handleSetCompleted = async () => {
    if (completeCourse) {
      completeCourse();
    } else {
      setCompleted();
    }
  };

  const isLoading = isLoadingCompleteCourse || isLoadingMutateCompleted;

  return (
    <div>
      <button
        disabled={isLoadingCompleteCourse || completed}
        onClick={handleSetCompleted}
        className="mt-8 w-full rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
      >
        {isLoading && 'Loading...'}
        {completed && 'Course completed'}
        {!isLoading && !completed && 'Mark course as complete'}
      </button>
    </div>
  );
};
