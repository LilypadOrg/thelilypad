import { NextPage } from 'next';
import { toast } from 'react-toastify';
import { useContractRead } from 'wagmi';
import { trpc } from '~/utils/trpc';
import { MAIN_CONTRACT_ADDRESS, MAIN_CONTRACT_ABI } from '~/utils/contracts';

const Profile: NextPage = () => {
  const refreshUserStats = trpc.useMutation(['users.updateXPandLevel'], {
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: userProfile } = trpc.useQuery(['users.profile']);
  const { data: contractData } = useContractRead({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'getCourse',
    args: [0],
  });

  const completedCourses = userProfile?.courses.filter(
    (c) => c.completed === true
  );

  const enrolledCourses = userProfile?.courses.filter(
    (c) => c.completed === false && c.enrolled === true
  );

  return (
    <div>
      <button onClick={() => refreshUserStats.mutate()}>
        Refresh user stats
      </button>
      <div>XP: {userProfile?.xp}</div>
      <div>Level: {userProfile?.level.number}</div>
      <h6>Completed Courses</h6>
      {completedCourses && completedCourses.length > 0 ? (
        completedCourses.map(({ course }) => (
          <div key={course.id}>{course.title}</div>
        ))
      ) : (
        <div>Yo have not completed any course</div>
      )}
      <h6>Enrolled Courses</h6>
      {enrolledCourses && enrolledCourses.length > 0 ? (
        enrolledCourses.map(({ course }) => (
          <div key={course.id}>{course.title}</div>
        ))
      ) : (
        <div>You are not enrolled in any course</div>
      )}
    </div>
  );
};
export default Profile;
