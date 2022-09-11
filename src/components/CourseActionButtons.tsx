import { trpc } from '~/utils/trpc';
import { Session } from 'next-auth';
import { toast } from 'react-toastify';
import { MAIN_CONTRACT_ABI, MAIN_CONTRACT_ADDRESS } from '~/utils/contracts';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useSession } from 'next-auth/react';

const CourseActionButtons = ({
  user,
  courseId,
}: {
  user: Session['user'];
  courseId: number;
}) => {
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const { data, refetch } = trpc.useQuery(
    ['usercourses.status', { userId: user.userId, courseId }],
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  const { data: onChainProfile, isSuccess: isSuccessOnChainProfile } =
    useContractRead({
      addressOrName: MAIN_CONTRACT_ADDRESS,
      contractInterface: MAIN_CONTRACT_ABI,
      functionName: 'getMember',
      enabled: !!session?.user,
      args: [session?.user.address],
      onSuccess: (data) => {
        console.log('On chain profile');
        console.log(data);
      },
    });

  const { data: completeEventSignature } = trpc.useQuery(
    [
      'blockend.signCompleteEvent',
      {
        address: user.address,
        courseId,
      },
    ],
    {
      enabled: !!onChainProfile?.pathChosen,
      onSuccess: (data) => {
        console.log('singnature');
        console.log(data);
      },
    }
  );

  const { config: completeCourseConfig, error } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'completeEvent',
    args: [user.address, courseId, completeEventSignature],
    enabled: !!onChainProfile && !!completeEventSignature,
    onError: (error) => {
      console.log('error');
      console.log(error);
    },
  });
  const { data: completeCourseRes, write: completeCourse } =
    useContractWrite(completeCourseConfig);

  const { isLoading: isLoadingCompleteCourse } = useWaitForTransaction({
    hash: completeCourseRes?.hash,
    onSuccess: () => {
      setCompleted();
    },
  });

  const mutateCompleted = trpc.useMutation(['usercourses.complete'], {
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      refetch();
      // TODO: figure out whty setQueryData doesn't refresh the value of the data variable
      // queryClient.setQueryData(
      //   [
      //     'usercourses.status',
      //     { userId: variables.userId, courseId: variables.courseId },
      //   ],
      //   data
      // );
    },
  });
  const mutateEnrolled = trpc.useMutation(['usercourses.enroll'], {
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      refetch();
      // TODO: figure out whty setQueryData doesn't refresh the value of the data variable
      // queryClient.setQueryData(
      //   [
      //     'usercourses.status',
      //     { userId: variables.userId, courseId: variables.courseId },
      //   ],
      //   data
      // );
    },
  });

  const refreshUserStats = trpc.useMutation(['users.updateXPandLevel'], {
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      utils.invalidateQueries(['users.byAddress', { address: user.address }]);
    },
  });

  const handleSetCompleted = async () => {
    console.log('Completion handler');
    console.log(onChainProfile);
    console.log(completeCourse);
    if (onChainProfile) {
      if (completeCourse) {
        completeCourse();
      }
    } else {
      setCompleted();
    }
  };

  const setCompleted = async () => {
    await mutateCompleted.mutateAsync({
      courseId,
      completed: true,
    });
    refreshUserStats.mutate();
  };

  const handleSetEnrolled = async () => {
    mutateEnrolled.mutate({
      courseId,
      enrolled: !data?.enrolled,
    });
  };

  return (
    <div className="mt-4 flex gap-4">
      {data && (
        <>
          <button onClick={handleSetEnrolled}>
            {data.enrolled ? 'Canel Enrollment' : 'Enroll'}
          </button>
          {!data.completed ? (
            `Course completed on ${data.completedOn}`
          ) : (
            <button
              disabled={!isSuccessOnChainProfile}
              onClick={handleSetCompleted}
            >
              {isLoadingCompleteCourse ? 'Loading...' : 'Mark as completed!'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CourseActionButtons;
