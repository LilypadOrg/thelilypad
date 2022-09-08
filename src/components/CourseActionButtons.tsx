import { trpc } from '~/utils/trpc';
import { Session } from 'next-auth';
import { toast } from 'react-toastify';

const CourseActionButtons = ({
  user,
  courseId,
}: {
  user: Session['user'];
  courseId: number;
}) => {
  const utils = trpc.useContext();

  const { data, refetch } = trpc.useQuery(
    ['usercourses.status', { userId: user.userId, courseId }],
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

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
      // TODO: figure out whty setQueryData doesn't refresh the value of the data variable
      utils.invalidateQueries(['users.profile']);
    },
  });

  const handleSetCompleted = async () => {
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
          {data.completed ? (
            `Course completed on ${data.completedOn}`
          ) : (
            <button onClick={handleSetCompleted}>Mark as completed!</button>
          )}
        </>
      )}
    </div>
  );
};

export default CourseActionButtons;
