import { BiAddToQueue } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { Course } from '~/types/types';
import { trpc } from '~/utils/trpc';

const AddCourseToRoadmap = ({
  course,
  type,
}: {
  course: Course;
  type: 'small' | 'standard';
}) => {
  const utils = trpc.useContext();

  const { mutate: mutateAddToRoadmap } = trpc.useMutation(
    ['usercourses.addToRoadmap'],
    {
      // onMutate: async () => {
      //   // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      //   await utils.cancelQuery(['courses.all']);

      //   // Snapshot the previous value
      //   const previousCourses = utils.getQueryData(['courses.all']);

      //   // Optimistically update to the new value
      //   const updatedCourse = { ...course };
      //   if (updatedCourse.course) {
      //     if (updatedCourse.course.userCourses.length > 0) {
      //       updatedCourse.course.userCourses[0].roadmap = !inRoadmap;
      //     } else {
      //       updatedCourse.course.userCourses.push({ roadmap: true });
      //     }
      //   }
      //   utils.setQueryData(['courses.all'], (old) => {
      //     if (old) {
      //       return old?.map((o) => (o.id === course.id ? updatedCourse : o));
      //     }
      //     return [updatedCourse];
      //   });

      //   // Return a context object with the snapshotted value
      //   // return { previousTodos };
      // },
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: () => {
        utils.invalidateQueries(['courses.bySlug', { slug: course.slug }]);
        utils.invalidateQueries(['courses.all']);
        utils.invalidateQueries(['courses.userRoadmap']);
      },
    }
  );

  const inRoadmap = course.course?.userCourses[0]?.roadmap || false;

  const handleAddToRoadmap = () => {
    mutateAddToRoadmap({
      courseId: course.id,
      roadmap: !inRoadmap,
    });
  };

  return type === 'standard' ? (
    <button
      onClick={handleAddToRoadmap}
      className="mt-8 w-full rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
    >
      {`${inRoadmap ? 'Remove from' : 'Add to'} personal roadmap`}
    </button>
  ) : (
    <button
      onClick={handleAddToRoadmap}
      className={`absolute bottom-2 right-2 rounded-lg bg-primary-300 p-1 text-xl ${
        inRoadmap
          ? 'text-white hover:text-black'
          : 'text-black hover:text-white'
      }`}
    >
      <BiAddToQueue />
    </button>
  );
};

export default AddCourseToRoadmap;
