import Link from 'next/link';
import { RoadmapCourses, UserCourses } from '~/types/types';
import { capitalizeFirstLetter } from '~/utils/formatters';
import CourseCard from './CourseCard';

const RoadmapByLevel = ({
  courses,
  level,
}: {
  courses: UserCourses;
  level: string;
}) => {
  return (
    <div
      className={`flex flex-col space-y-10 border-t-2 ${
        level === 'intermediate' ? 'bg-primary-100/80' : ''
      } border-primary-100/80 px-[2.5rem]  py-12 lg:px-[5.5rem]`}
    >
      <div className="flex space-x-8">
        <div className="flex flex-col space-y-6">
          <p className="text-md font-semibold leading-5 underline">
            {capitalizeFirstLetter(level)} -
            {courses.filter((f) => f.completed).length || 0} /{' '}
            {courses.length || 0}
          </p>
        </div>

        {/* TODO: replace with carousel component for all courses level */}
        <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
          {courses.map((course) => (
            /* Its same as CourseCard component */
            <CourseCard
              key={`roadmap-course-${course.course.id}`}
              course={course.course}
              type="simple"
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-x-4">
        <Link href={`/courses/browse/level/${level}`}>
          <button className="rounded-md bg-primary-700/80 py-2 px-2 font-semibold text-white lg:px-10 lg:py-2">
            More {capitalizeFirstLetter(level)} courses
          </button>
        </Link>
      </div>
    </div>
  );
};

const PersonalRoadmap = ({
  roadmapCourses,
}: {
  roadmapCourses: RoadmapCourses;
}) => {
  return (
    <>
      <div
        id="roadmap"
        className="flex flex-col px-[2.5rem]  py-16 lg:px-[5.5rem]"
      >
        <h1 className="mb-1 text-3xl font-bold">My Personal Roadmap</h1>
        <p className="font-light lg:w-[40%]">
          Populate this personal roadmap with courses of your choosing to set
          milestones for yourself and track your progress on a custom path!
        </p>
      </div>
      <RoadmapByLevel courses={roadmapCourses.beginner} level="beginner" />
      <RoadmapByLevel
        courses={roadmapCourses.intermediate}
        level="intermediate"
      />
      <RoadmapByLevel courses={roadmapCourses.advanced} level="advanced" />
    </>
  );
};

export default PersonalRoadmap;
