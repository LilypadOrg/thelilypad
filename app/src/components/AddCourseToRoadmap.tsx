import { BiAddToQueue } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { trpc } from '~/utils/trpc';

const AddCourseToRoadmap = () => {
  const { mutate: mutateEnrolled } = trpc.useMutation(
    ['usercourses.addToRoadmap'],
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  return (
    <button className="absolute bottom-2 right-2 rounded-lg bg-primary-300 p-1 text-xl">
      <BiAddToQueue />
    </button>
  );
};

export default AddCourseToRoadmap;
