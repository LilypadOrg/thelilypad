import React from 'react';
import CourseCard from './CourseCard';

interface Props {
  bgColor?: string;
  title: string;
}

const CourseCarousel = ({ bgColor, title }: Props) => {
  return (
    <div className={`my-8 ${bgColor && bgColor}`}>
      <h1 className="mt-8 text-4xl">{title}</h1>
      {/* Card Container */}
      <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
        {/* card */}
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
    </div>
  );
};

export default CourseCarousel;
