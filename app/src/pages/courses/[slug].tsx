import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import AddCourseToRoadmap from '~/components/AddCourseToRoadmap';
import { CompleteCourse } from '~/components/CompleteCourse';
import { trpc } from '~/utils/trpc';

const categories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const CoursePage: NextPage = () => {
  const slug = useRouter().query.slug;
  const { data: course, isLoading } = trpc.useQuery([
    'courses.bySlug',
    { slug: Array.isArray(slug) ? slug[0] : slug || '' },
  ]);

  const { data: session } = useSession();

  if (isLoading) {
    return <div>Loading</div>;
  }

  return course ? (
    <div>
      <div className="px-[5.5rem]">
        <div className="flex flex-col py-8">
          <h1 className="mb-4 text-4xl font-bold">{course?.title}</h1>
          <p className="max-w-xl  font-light">
            {/* Become An Ethereum Blockchain Developer With One Course. Master */}
            Solidity, Web3.JS, Truffle, Metamask, Remix & More!
          </p>
        </div>
        {/* hero image */}
        <div className="flex h-[600px] w-full items-center justify-center rounded-md bg-main-gray-light">
          {/* play button */}
          {/* <div className="h-14 w-14 rounded-full bg-secondary-400 shadow-md"></div> */}
        </div>
        {/* Intro and desc */}
        <div className="mt-6 flex flex-col space-y-6">
          {/* <div className="flex flex-col space-y-2">
            <h1 className="mb-0 text-3xl font-semibold">Introduction</h1>
            <p className="max-w-5xl font-light">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Distinctio, nulla impedit quaerat debitis cupiditate omnis
              veritatis, asperiores vel quae qui quia praesentium blanditiis,
              itaque quam ipsum deserunt placeat porro. Vitae, ipsa cumque?
            </p>
          </div> */}
          <div className="flex flex-col space-y-2">
            <h1 className="mb-0 text-3xl font-semibold">Description</h1>
            <p className="max-w-5xl font-light">{course?.description}</p>
          </div>
        </div>
        {session && (
          <>
            <AddCourseToRoadmap course={course} type="standard" />
            <CompleteCourse course={course} user={session.user} />

            <button className="mt-8 w-full rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500">
              Take final test
            </button>
          </>
        )}
      </div>
      {/* Course Carousel */}
      {/* 
          <div className="bg-main-gray-light pt-2 pb-4">
            <div className="px-[5.5rem]">
              <CourseCarousel title={`Top 10 ${topic} Courses`} courses={courses} />
            </div>
          </div> 
      */}
      <div className="px-[5.5rem]">
        <div className="my-10 w-full space-y-4">
          <h1 className="mt-8 text-4xl">Other Categories</h1>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat) => {
              return (
                <Link href={`/courses/browse/`} key={cat}>
                  <button className="flex justify-between rounded-md bg-main-gray-light py-2 px-4">
                    <p className="">Something (1)</p>
                    <p className="font-normal">&#62;</p>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <h1 className="text-4xl">Something about the community</h1>
          <div className="flex space-x-8">
            <div className="min-h-[353px] min-w-[60%]  rounded-lg bg-main-gray-dark text-white"></div>
            <div className="flex flex-col space-y-4">
              <p className="font-semibold">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the.
              </p>
              <p className="font-[350]">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don&apos;t look even
                slightly believable. If you are going to use a passage of Lorem
                Ipsum, you need to be sure there isn&apos;t anything
                embarrassing hidden in the middle of text.
              </p>
              <div className="flex justify-between rounded-md bg-main-gray-light py-2 px-4">
                <p>Go somewhere else</p>
                <p className="font-normal">&#62;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>No course found</div>
  );
};

export default CoursePage;
