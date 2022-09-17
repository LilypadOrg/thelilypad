import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { Session } from 'next-auth';
import { MAIN_CONTRACT_ABI, MAIN_CONTRACT_ADDRESS } from '~/utils/contracts';
import { trpc } from '~/utils/trpc';
import { Course } from '~/types/types';
import { toast } from 'react-toastify';

export const CompleteCourse = ({
  user,
  course,
}: {
  user: Session['user'];
  course: Course;
}) => {
  const completed = course.course?.userCourses[0]?.completed || false;
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
        courseId: course.id,
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
    args: [user.address, course.id, completeEventSignature],
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
      utils.invalidateQueries(['courses.bySlug', { slug: course.slug }]);
    },
  });

  const setCompleted = async () => {
    await mutateCompleted.mutateAsync({
      courseId: course.id,
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
          `Course completed on 
          ${course.course?.userCourses[0].completedOn?.toLocaleDateString(
            'en-gb',
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
