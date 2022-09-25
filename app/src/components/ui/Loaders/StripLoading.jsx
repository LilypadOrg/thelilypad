import { HiChevronRight } from 'react-icons/hi';

export const StripLoading = () => {
  return (
    <div>
      <button className="flex animate-pulse items-center justify-between rounded-md bg-gray-300 py-2 px-4">
        <p className="text-transparent">blockchain ({3})</p>
        <p className="mt-[0.1rem] text-xl font-bold text-transparent">
          <HiChevronRight />
        </p>
      </button>
    </div>
  );
};
