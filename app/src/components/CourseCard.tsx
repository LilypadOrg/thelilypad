import React from 'react';

const CourseCard = () => {
  return (
    <div className="min-w-[20rem]  rounded-lg shadow-lg">
      <div className="h-36 w-full  rounded-tr-lg rounded-tl-lg bg-main-gray-dark"></div>
      <div className="px-4 pt-4 pb-2">
        <span className="mr-2 mb-2 inline-block rounded-full bg-main-gray-dark px-3 py-1 text-sm font-semibold text-black ">
          Beginner
        </span>
      </div>
      <div className="px-4 py-4">
        <div className="mb-2 text-xl font-bold">
          Lorem ipsum dolor sit amet consectetur.
        </div>
        <p className="text-base text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
