import classNames from 'classnames';
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';

interface CourseFilter {
  id: number;
  slug: string;
  _count: {
    contents: number;
  };
  name: string;
}

const BrowseCoursesLink = ({
  courseFilter,
  courseFilterType,
  className,
}: {
  courseFilter: CourseFilter;
  courseFilterType: string;
  className?: string;
}) => {
  return (
    <Link href={`/courses/browse/${courseFilterType}/${courseFilter.slug}`}>
      <button
        className={classNames(
          'flex w-full items-center justify-between rounded-md bg-primary-300 py-2 px-4',
          className
        )}
      >
        <p>
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
