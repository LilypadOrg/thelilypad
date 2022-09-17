import Image from 'next/image';
import React from 'react';
import { Course } from '~/types/types';
import { limitStrLength } from '~/utils/formatters';
import LevelPill from './ui/LevelPill';
import AddCourseToRoadmap from './AddCourseToRoadmap';
import { BsCheck2 } from 'react-icons/bs';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { trpc } from '~/utils/trpc';

const CourseCard = ({
  course,
  type = 'full',
}: {
  course: Course;
  type?: 'full' | 'simple';
}) => {
  const { data: session } = useSession();

  const { data: userCourses } = trpc.useQuery(
    ['usercourses.all', { userId: session?.user.userId || -1 }],
    {
      enabled: !!session,
      onSuccess: () => {
        console.log('Loaded user courses');
      },
    }
  );

  const completed = !!userCourses?.find(
    (c) => c.courseId === course.id && c.completed
  );
  const inRoadmap = !!userCourses?.find(
    (c) => c.courseId === course.id && c.roadmap
  );

  return (
    <div className="flex  min-w-[20rem] flex-col justify-between rounded-lg shadow-lg">
      <div className="relative h-[182px]  w-full rounded-tr-lg rounded-tl-lg bg-main-gray-dark">
        <Link href={`/courses/${course.content.slug}`}>
          <a>
            {course.content.coverImageUrl && (
              <Image
                src={course.content.coverImageUrl}
                alt="Course thumbnail"
                layout="fill"
                objectFit="contain"
              />
            )}
          </a>
        </Link>
      </div>

      {type === 'full' && (
        <div className="flex items-start justify-between px-4 pt-4 pb-2">
          <div>
            {course.levels.map((l) => (
              <LevelPill key={`course-${course.id}-${l.id}`} level={l.name} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col justify-between px-4 py-4">
        <div className="mb-2 text-lg font-bold">
          <Link href={`/courses/${course.content.id}/${course.content.slug}`}>
            {course.content.title}
          </Link>
        </div>
        {type === 'full' && (
          <div className=" text-ellipsis text-base text-gray-700">
            {limitStrLength(course.content.description, 80)}
          </div>
        )}
      </div>
      {session && (
        <div className="mb-2 mr-2 flex items-center justify-end gap-x-2">
          {completed && (
            <div className="rounded-full border-2 bg-green-600 p-2  text-lg text-white">
              <BsCheck2 />
            </div>
          )}

          <AddCourseToRoadmap
            courseId={course.id}
            inRoadmap={inRoadmap}
            type="small"
          />
        </div>
      )}
    </div>
  );
};

export default CourseCard;
