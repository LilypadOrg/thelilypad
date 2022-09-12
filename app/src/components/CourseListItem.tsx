import Image from 'next/image';
import Link from 'next/link';
import { inferQueryOutput } from '~/utils/trpc';

type Course = inferQueryOutput<'courses.byId'>;

const CourseListItem = ({ course }: { course: Course }) => {
  return (
    <div key={`course-${course.id}`} className="flex flex-row gap-4">
      <div className=" w-[20%]">
        <Image
          src={course.coverImageUrl || ''}
          alt={`${course.title} thumbnail`}
          width="200px"
          height="140px"
          layout="intrinsic"
        />
      </div>
      <div className=" w-[80%]">
        <h4>
          <Link href={`/courses/${course.id}/${course.slug}`}>
            <a>{course.title}</a>
          </Link>
        </h4>
        <p>{course.description}</p>
      </div>
    </div>
  );
};

export default CourseListItem;
