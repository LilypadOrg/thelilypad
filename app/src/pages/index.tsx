import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CourseCarousel from '~/components/CourseCarousel';
import {
  HOMEPAGE_COURSE_CAROUSEL,
  HOMEPAGE_FEATURED_ITEMS,
} from '~/utils/constants';
import { api } from '~/utils/api';
// import { useSession } from 'next-auth/react';
import { SpotLightCards } from '~/components/ui/Home';
import { SpotLightCardsLoading } from '~/components/ui/Loaders';
import { HiChevronRight } from 'react-icons/hi';
import SectionTitle from '~/components/ui/SectionTitle';

const Home: NextPage = () => {
  // load courses for courses section
  const { data: courses, isLoading: coursesLoading } = api.courses.all.useQuery(
    { take: HOMEPAGE_COURSE_CAROUSEL }
  );

  // load projects for featured section
  const { data: projects, isLoading: projectsLoading } =
    api.projects.all.useQuery({ take: HOMEPAGE_FEATURED_ITEMS });
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
  return (
    <div>
      {/* Hero and cards */}
      <div className="h-[calc(100vh-4rem)] bg-[url('/homeBanner.png')] bg-cover bg-center">
        <div className="grid h-full w-full grid-cols-1 bg-dark-blue/50 px-6 py-6 lg:grid-cols-12 lg:justify-items-end">
          {/* Left */}
          <div className="flex flex-col items-center space-y-6 lg:col-span-7 lg:items-start lg:justify-center">
            <div className="space-y-3">
              <p className="text-2xl font-semibold leading-[1.9rem] text-white lg:text-5xl">
                A community{' '}
                <span className="text-main-yellow">endeavouring</span> to guide
                those <span className="text-main-yellow">self-learning</span> in
                Web3
              </p>
              {/* <p className="text-2xl text-secondary-400">#GoYou</p> */}
            </div>
            <div className="flex flex-col items-center space-y-8 lg:max-w-[90%]">
              <div className="flex w-full justify-between">
                <div className="flex flex-col justify-between">
                  <p className="text-xl text-gray-300 lg:text-3xl">
                    <span className="font-bold">
                      Track your self-learning progress
                    </span>{' '}
                    and show it ot the world through the{' '}
                    <span className="font-bold">soulbound token</span>
                  </p>
                  <div className="my-3 flex items-center text-lg font-semibold lg:text-xl">
                    <HiChevronRight className="text-2xl text-secondary-400" />
                    <p className="text-secondary-400">Learn More</p>
                  </div>
                </div>
              </div>
              <button className="btn-primary text-xl font-semibold leading-4 tracking-wide text-white lg:mt-2 lg:self-start">
                {' '}
                Minting now !
              </button>
            </div>
          </div>
          {/* Right */}
          <div className="order-first flex h-full items-center justify-center rounded-lg lg:order-last lg:col-span-5">
            <Image
              src="/images/sbt-frontpage.gif"
              alt="sbt"
              layout="intrinsic"
              width="475px"
              height="375px"
              className="block rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Community Spotligh */}
      <div className="px-[2.5rem] pt-8 lg:px-[5.5rem]">
        <div className="my-8">
          {/* First three collection */}
          <SectionTitle title="Community Spotlight" />

          <div className="md: grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projectsLoading &&
              [1, 2, 3, 4, 5, 6].map((i) => <SpotLightCardsLoading key={i} />)}
            {projects?.map((p, index: number) => (
              <SpotLightCards
                project={p}
                key={p.id}
                teal={Boolean(index % 2)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Divider */}
      <hr className="my-14 w-full bg-main-gray-dark" />
      {/* Top 10 courses */}
      <div className="px-[2.5rem]  pb-12 lg:px-[5.5rem]">
        <CourseCarousel
          title="Top 10 Courses"
          courses={courses}
          isLoading={coursesLoading}
        />
      </div>
      {/* View all resources  */}
      <div className="w-full space-y-4 bg-primary-300/80 px-8 py-5">
        <h1 className="mt-0 text-4xl">Or View all resources</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {bigResourceList.map((courseName, i) => (
            <div
              className="flex justify-between rounded-md bg-black py-2 px-4 text-white"
              key={`${i}-${courseName}`}
            >
              <p className="">{courseName}</p>
              <p className="font-normal">&#62;</p>
            </div>
          ))}
        </div>
        {/* view AllCourse one tab*/}
        <div className="mt-14 w-full">
          <div className="flex justify-between rounded-md bg-black px-4 py-2 text-white lg:w-[30%] lg:py-2">
            <Link href="courses">
              <button className="col-span-2 flex items-center justify-between rounded-md lg:px-4 lg:py-2">
                <p className="font-semibold">View all Courses</p>
                <p className="mt-[0.1rem] text-xl font-bold">
                  <HiChevronRight />
                </p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
