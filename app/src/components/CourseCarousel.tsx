import React from 'react';
import { Courses } from '~/types/types';
import CourseCard from './CourseCard';
import { CourseCardLoading } from './ui/Loaders';

interface Props {
  bgColor?: string;
  title: string;
  courses?: Courses;
  type?: 'simple' | 'full';
  isLoading: boolean;
}

const loaders = [1, 2, 3, 4, 5];

const CourseCarousel = ({
  bgColor,
  title,
  courses,
  type = 'full',
  isLoading,
}: Props) => {
  return (
    <div className={`my-8 ${bgColor && bgColor}`}>
      <h1 className="mt-8 text-4xl">{title}</h1>
      {/* Card Container */}
      <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
        {isLoading && !courses
          ? loaders.map((i) => <CourseCardLoading key={i} />)
          : courses!.map((course) => (
              <CourseCard
                key={`course-${course.id}`}
                course={course}
                type={type}
              />
            ))}
      </div>
    </div>
  );
};

export default CourseCarousel;
