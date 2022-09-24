import React from 'react';
import CourseCard from '~/components/CourseCard';
import CourseCarousel from '~/components/CourseCarousel';
import { COURSES_HOME_ITEMS } from '~/utils/constants';
import { trpc } from '~/utils/trpc';

const Courses = () => {
  const { data: courses } = trpc.useQuery([
    'courses.all',
    // { take: COURSES_HOME_ITEMS },
  ]);

  const filterTags = ['blockchain', 'web3'];

  const { data: tags } = trpc.useQuery(['tags.all', { tags: filterTags }]);

  // const courses = trpc.useQuery(['courses.all', { tags: tags }], {
  //   enabled: filterTags,
  // });

  return (
    <div className="px-[5.5rem]">
      <h1 className="mb-2 mt-2 text-4xl">Courses</h1>
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-3">
          {tags &&
            courses &&
            tags.map((t) => {
              const filteredCourses = courses.filter((c) =>
                c.content.tags.filter((t2) => t2.slug === t.slug)
              );
              if (filteredCourses)
                return (
                  <div key={`courses-tag-${t}`}>
                    <CourseCarousel
                      title={`${t.name} courses`}
                      courses={filteredCourses}
                    />
                  </div>
                );
            })}
        </div>
        {/* Aside */}
        <div className="flex flex-col gap-10">
          <h1 className="mt-8 text-4xl">Top courses</h1>
          {courses?.slice(0, COURSES_HOME_ITEMS).map((c) => (
            <CourseCard key={`courses-${c.id}`} course={c} />
          ))}
        </div>

        {/* 1st col */}
        {/* <div className="flex flex-col gap-8">
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
          </div> */}
        {/* 2nd col */}
        {/* <div className="flex flex-col gap-8">
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
        </div> */}
        {/* Aside */}
      </div>
    </div>
  );
};

export default Courses;
