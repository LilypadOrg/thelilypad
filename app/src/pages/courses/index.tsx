import React from 'react';
import CourseCard from '~/components/CourseCard';
import CourseCarousel from '~/components/CourseCarousel';
import { CourseCardLoading } from '~/components/ui/Loaders';
import { COURSES_HOME_ITEMS } from '~/utils/constants';
import { trpc } from '~/utils/trpc';

const Loader = () => {
  return (
    <div className={`my-8`}>
      <h1 className="mt-8 w-[30%] rounded-md bg-gray-400 text-4xl text-transparent">
        Web3 Courses
      </h1>
      {/* Card Container */}
      <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <CourseCardLoading key={i} />
        ))}
      </div>
    </div>
  );
};

const Courses = () => {
  const { data: courses, isLoading: coursesLoading } = trpc.useQuery([
    'courses.all',
    // { take: COURSES_HOME_ITEMS },
  ]);

  const filterTags = ['web2', 'web3'];

  const { data: tags, isLoading: tagsLoading } = trpc.useQuery([
    'tags.all',
    { tags: filterTags },
  ]);

  // const courses = trpc.useQuery(['courses.all', { tags: tags }], {
  //   enabled: filterTags,
  // });

  return (
    <div className="gradient-bg-top-courses px-[5.5rem] pt-2">
      <h1 className="mb-2 mt-2 text-4xl">Courses</h1>
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-3">
          {(tagsLoading || coursesLoading) && <Loader />}
          {tags &&
            courses &&
            tags.map((t) => {
              const filteredCourses = courses.filter(
                (c) => !!c.content.tags.find((t2) => t2.slug === t.slug)
              );
              if (filteredCourses)
                return (
                  <div key={`courses-tag-${t}`}>
                    <CourseCarousel
                      title={`${t.name} courses`}
                      courses={filteredCourses}
                      isLoading={tagsLoading && coursesLoading}
                    />
                  </div>
                );
            })}
        </div>
        {/* Aside */}
        <div className="flex flex-col gap-10">
          <h1 className="mt-8 text-4xl">Top courses</h1>
          {coursesLoading &&
            [1, 2, 3, 4].map((i) => <CourseCardLoading key={i} />)}
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
