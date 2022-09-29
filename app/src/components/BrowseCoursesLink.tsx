import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';

interface CourseFilter {
  type: string;
  id: number;
  slug: string;
  _count: {
    contents: number;
  };
  name: string;
}

const BrowseCoursesLink = ({
  courseFilter,
}: {
  courseFilter: CourseFilter;
}) => {
  return (
    <Link href={`/courses/browse/${courseFilter.type}/${courseFilter.slug}`}>
      <button className="flex items-center justify-between rounded-md bg-main-gray-light py-2 px-4">
        <p className="">
          {courseFilter.name} ({courseFilter._count.contents})
        </p>
        <p className="mt-[0.1rem] text-xl font-bold">
          <HiChevronRight />
        </p>
      </button>
    </Link>
  );
};

export default BrowseCoursesLink;
