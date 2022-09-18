import React from 'react';
import CourseCard from '~/components/CourseCard';
import { ContentType } from '~/types/types';
import { COURSES_HOME_ITEMS } from '~/utils/constants';
import { trpc } from '~/utils/trpc';

const coursesList = [
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
];

const bigResourceList1 = [...coursesList];
const bigResourceList2 = [
  ...coursesList,
  coursesList[0],
  coursesList[1],
  coursesList[2],
];
const bigResourceList3 = [
  coursesList[0],
  coursesList[1],
  coursesList[2],
  coursesList[3],
];

const bigResourceList4 = [
  coursesList[0],
  coursesList[1],
  coursesList[2],
  coursesList[3],
];
const bigResourceList5 = [
  coursesList[0],
  coursesList[1],
  coursesList[2],
  coursesList[3],
];

const Courses = () => {
  const { data: courses } = trpc.useQuery([
    'courses.all',
    { take: COURSES_HOME_ITEMS },
  ]);

  return (
    <div className="px-[5.5rem]">
      <h1 className="mb-2 mt-2 text-4xl">Courses</h1>
      <div className="flex gap-8">
        <div className="grid w-[66%] grid-cols-2 gap-6">
          {/* 1st col */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-4 text-xl font-bold">Frontend</p>
              <div className="flex flex-col gap-2">
                {bigResourceList1.map((courseName, i) => (
                  <div
                    className="flex justify-between rounded-md bg-main-gray-light py-2 px-4"
                    key={`${i}-${courseName}`}
                  >
                    <p className="">{courseName}</p>
                    <p className="font-normal">&#62;</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xl font-bold">Backend</p>
              <div className="flex flex-col gap-2">
                {bigResourceList2.map((courseName, i) => (
                  <div
                    className="flex justify-between rounded-md bg-main-gray-light py-2 px-4"
                    key={`${i}-${courseName}`}
                  >
                    <p className="">{courseName}</p>
                    <p className="font-normal">&#62;</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xl font-bold">FlexBox</p>
              <div className="flex flex-col gap-2">
                {bigResourceList3.map((courseName, i) => (
                  <div
                    className="flex justify-between rounded-md bg-main-gray-light py-2 px-4"
                    key={`${i}-${courseName}`}
                  >
                    <p className="">{courseName}</p>
                    <p className="font-normal">&#62;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 2nd col */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-4 text-xl font-bold">Solidity</p>
              <div className="flex flex-col gap-2">
                {bigResourceList4.map((courseName, i) => (
                  <div
                    className="flex justify-between rounded-md bg-main-gray-light py-2 px-4"
                    key={`${i}-${courseName}`}
                  >
                    <p className="">{courseName}</p>
                    <p className="font-normal">&#62;</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xl font-bold">React</p>
              <div className="flex flex-col gap-2">
                {bigResourceList4.map((courseName, i) => (
                  <div
                    className="flex justify-between rounded-md bg-main-gray-light py-2 px-4"
                    key={`${i}-${courseName}`}
                  >
                    <p className="">{courseName}</p>
                    <p className="font-normal">&#62;</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xl font-bold">Python</p>
              <div className="flex flex-col gap-2">
                {bigResourceList5.map((courseName, i) => (
                  <div
                    className="flex justify-between rounded-md bg-main-gray-light py-2 px-4"
                    key={`${i}-${courseName}`}
                  >
                    <p className="">{courseName}</p>
                    <p className="font-normal">&#62;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Aside */}
        <div className="flex flex-col gap-10">
          {courses?.map((c) => (
            <CourseCard key={`courses-${c.id}`} course={c} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
