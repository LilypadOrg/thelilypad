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
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: () => {
        utils.courses.byId.invalidate({ id: courseId });
        utils.courses.byUsername.invalidate();
        // TODO: not optimal, as it reload all courses, but works for now
        utils.courses.all.invalidate();
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
