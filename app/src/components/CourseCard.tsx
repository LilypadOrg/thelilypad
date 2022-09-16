import Image from 'next/image';
import React from 'react';
import { Course } from '~/types/types';
import { limitStrLength } from '~/utils/formatters';
import LevelPill from './ui/LevelPill';
import AddCourseToRoadmap from './AddCourseToRoadmap';

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="min-w-[20rem]  rounded-lg shadow-lg">
      <div className="relative h-[182px]  w-full rounded-tr-lg rounded-tl-lg bg-main-gray-dark">
        {course.coverImageUrl && (
          <Image
            src={course.coverImageUrl}
            alt="Course thumbnail"
            layout="fill"
            objectFit="contain"
          />
        )}
        <div className="absolute bottom-2 right-2">
          <AddCourseToRoadmap />
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        {course.course?.levels.map((l) => (
          <LevelPill key={`course-${course.id}-${l.id}`} level={l.name} />
        ))}
      </div>
      <div className="flex flex-col justify-between px-4 py-4">
        <div className="mb-2 text-lg font-bold">{course.title}</div>
        <div className=" text-ellipsis text-base text-gray-700">
          {limitStrLength(course.description, 80)}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
