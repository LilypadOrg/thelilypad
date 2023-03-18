import { BiAddToQueue } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { api } from '~/utils/api';

const AddCourseToRoadmap = ({
  courseId,
  inRoadmap,
  type,
}: {
  courseId: number;
  inRoadmap: boolean;
  type: 'small' | 'standard';
}) => {
  const utils = api.useContext();

  const { mutate: mutateAddToRoadmap } =
    api.usercourses.addToRoadmap.useMutation({
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
        utils.courses.byId.invalidate({ id: courseId });
        utils.courses.byUsername.invalidate();
      },
    });

  const handleAddToRoadmap = () => {
    mutateAddToRoadmap({
      courseId,
      roadmap: !inRoadmap,
    });
  };

  return type === 'standard' ? (
    <button
      onClick={handleAddToRoadmap}
      className="absolute rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
    >
      {`${inRoadmap ? 'Remove from' : 'Add to'} personal roadmap`}
    </button>
  ) : (
    <button
      onClick={handleAddToRoadmap}
      className={`rounded-full border-2 bg-primary-300 p-2 text-lg ${
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
