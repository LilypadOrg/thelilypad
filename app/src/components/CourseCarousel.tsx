import React from 'react';
import { Courses } from '~/types/types';
import CourseCard from './CourseCard';

interface Props {
  bgColor?: string;
  title: string;
  courses: Courses;
  type: 'simple' | 'full';
}

const CourseCarousel = ({ bgColor, title, courses, type = 'full' }: Props) => {
  return (
    <div className={`my-8 ${bgColor && bgColor}`}>
      <h1 className="mt-8 text-4xl">{title}</h1>
      {/* Card Container */}
      <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
        {courses.map((course) => (
          <CourseCard key={`course-${course.id}`} course={course} type={type} />
        ))}
      </div>
    </div>
  );
};

export default CourseCarousel;
