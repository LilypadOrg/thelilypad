import type { NextPage } from 'next';
import Link from 'next/link';
import CourseCarousel from '~/components/CourseCarousel';
import { ContentType } from '~/types/types';
import { HOMEPAGE_COURSE_FILTERS } from '~/utils/constants';
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

const bigResourceList = [...coursesList];

const Home: NextPage = () => {
  const { data: techs } = trpc.useQuery([
    'technologies.byContentTYpe',
    { contentType: ContentType.COURSE },
  ]);
  const { data: tags } = trpc.useQuery([
    'tags.byContentTYpe',
    { contentType: ContentType.COURSE },
  ]);

  const { data: courses } = trpc.useQuery(['courses.all']);

  return (
    <div>
      {/* Hero and cards */}
      <div className="px-[5.5rem]">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 flex flex-col space-y-4 ">
            {/* Hero Image */}
            <div className="relative min-h-[353px]  rounded-lg bg-main-gray-dark text-white">
              <div className=" absolute bottom-4 right-4 max-w-[25%] space-y-2 rounded-lg bg-primary-400 p-4">
                <h1 className="mb-0 text-lg">The Lily Pad</h1>
                <p className=" break-all text-sm font-light leading-[1.1]">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-sm font-light">#goForYou</p>
              </div>
            </div>
            {/* we help you grow */}
            <div className="flex flex-col rounded-lg bg-main-gray-light p-6">
              {/* Heading and sub */}
              <div>
                <h1 className="mb-0 text-2xl">
                  We help you grow, learn & excell
                </h1>
                <span className="text-sm font-light">
                  Discover what we are all about
                </span>
              </div>
              {/* List */}
              <div className="mt-4 grid  w-[85%] grid-cols-2 gap-8 ">
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">RandoLorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
              </div>
            </div>
          </div>
          {/* Side List */}
          <div className="h-full rounded-lg  bg-main-gray-light py-5 px-6">
            {/* header */}
            <div className="mt-6">
              <h1 className="mb-0 text-2xl">Courses</h1>
              <p className="text-sm">
                Become a real dev not just a fake one, we have evrything you
                need to be the best you can be
              </p>
            </div>
            {/* List */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="courses">
                <button className="col-span-2 flex justify-between rounded-md bg-white py-2 px-4">
                  <p className="">All Courses</p>
                  <p className="font-normal">&#62;</p>
                </button>
              </Link>

              {tags &&
                techs &&
                tags
                  .map((t) => ({ ...t, type: 'tag' }))
                  .concat(techs.map((t) => ({ ...t, type: 'tech' })))
                  .sort((a, b) => b._count.contents - a._count.contents)
                  .slice(0, HOMEPAGE_COURSE_FILTERS)
                  .map((courseFilter) => (
                    <Link
                      href={`/courses/browse/${courseFilter.type}/${courseFilter.slug}`}
                      key={`home-coursefilter-${courseFilter.slug}`}
                    >
                      <button className="flex justify-between rounded-md bg-white py-2 px-4">
                        <p className="">
                          {courseFilter.name} ({courseFilter._count.contents})
                        </p>
                        <p className="font-normal">&#62;</p>
                      </button>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
        {/* Collection */}
        <div className="my-8">
          {/* First three collection */}
          <div className="grid grid-cols-3  gap-8">
            <div className="relative h-[320px] rounded-lg bg-main-gray-dark ">
              <div className=" absolute bottom-4 right-4 max-w-[45%] space-y-2 rounded-lg bg-primary-400 p-4 text-white">
                <h1 className="mb-0 text-lg">The Lily Pad</h1>
                <p className=" break-all text-sm font-light leading-[1.1]">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-sm font-light">#goForYou</p>
              </div>
            </div>
            <div className="relative h-[320px] rounded-lg bg-main-gray-dark">
              <div className=" absolute bottom-4 right-4 max-w-[45%] space-y-2 rounded-lg bg-secondary-400 p-4 text-white">
                <h1 className="mb-0 text-lg">The Lily Pad</h1>
                <p className=" break-all text-sm font-light leading-[1.1]">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-sm font-light">#goForYou</p>
              </div>
            </div>
            <div className="relative h-[320px] rounded-lg bg-main-gray-dark">
              <div className=" absolute bottom-4 right-4 max-w-[45%] space-y-2 rounded-lg bg-primary-400 p-4 text-white">
                <h1 className="mb-0 text-lg">The Lily Pad</h1>
                <p className=" break-all text-sm font-light leading-[1.1]">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-sm font-light">#goForYou</p>
              </div>
            </div>
          </div>
          {/* Next two collection */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="relative h-[320px] rounded-lg  bg-main-gray-dark">
              <div className="absolute bottom-4 right-4 max-w-[45%] space-y-2 rounded-lg bg-primary-400 p-4 text-white">
                <h1 className="mb-0 text-lg">The Lily Pad</h1>
                <p className=" break-all text-sm font-light leading-[1.1]">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-sm font-light">#goForYou</p>
              </div>
            </div>
            <div className="relative h-[320px] rounded-lg  bg-main-gray-dark">
              <div className=" absolute bottom-4 right-4 max-w-[45%] space-y-2 rounded-lg bg-primary-400 p-4 text-white">
                <h1 className="mb-0 text-lg">The Lily Pad</h1>
                <p className=" break-all text-sm font-light leading-[1.1]">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-sm font-light">#goForYou</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-14 w-full bg-main-gray-dark" />
      <div className="px-[5.5rem]">
        {/* Top 10 courses */}
        <CourseCarousel title="Top 10 Courses" courses={courses} />
        {/* view AllCourse one tab*/}
        <div className="my-14 w-full">
          <div className="flex w-[30%] justify-between rounded-md bg-main-gray-light py-2 px-4">
            <p className="font-semibold">View all Courses</p>
            <p className="font-semibold">&#62;</p>
          </div>
        </div>
        {/* View all resources  */}
        <div className="my-10 w-full space-y-4">
          <h1 className="mt-8 text-4xl">Or View all resources</h1>
          <div className="grid grid-cols-4 gap-4">
            {bigResourceList.map((courseName, i) => (
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
  );
};

export default Home;
