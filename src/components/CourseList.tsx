import CourseListItem from './CourseListItem';
import { inferQueryOutput } from '~/utils/trpc';

type Courses = inferQueryOutput<'courses.all'>;

const CourseList = ({ courses }: { courses: Courses }) => {
  return (
    <div className="flex flex-col gap-8">
      {courses.map((course) => (
        <CourseListItem key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
