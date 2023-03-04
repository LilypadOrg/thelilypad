import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CourseCarousel from '~/components/CourseCarousel';
// import { ContentType } from '~/types/types';
import {
  HOMEPAGE_COURSE_CAROUSEL,
  // HOMEPAGE_COURSE_FILTERS,
  HOMEPAGE_FEATURED_ITEMS,
} from '~/utils/constants';
import { trpc } from '~/utils/trpc';
// import { useSession } from 'next-auth/react';
import { SpotLightCards } from '~/components/ui/Home';
import { SpotLightCardsLoading } from '~/components/ui/Loaders';
import { HiChevronRight } from 'react-icons/hi';
// import AboutHomeLinks from '~/components/AboutHomeLinks';
// import BrowseCoursesLink from '~/components/BrowseCoursesLink';
// import { useMemo } from 'react';

const Home: NextPage = () => {
  // Load techs for side bar links - top tags and techs
  // const { data: techs, isLoading: techsLoading } = trpc.useQuery([
  //   'technologies.byContentTYpe',
  //   { contentType: ContentType.COURSE },
  // ]);

  // Load tags for side bar links - top tags and techs
  // const { data: tags, isLoading: tagsLoading } = trpc.useQuery([
  //   'tags.byContentTYpe',
  //   { contentType: ContentType.COURSE },
  // ]);

  // const { data: session } = useSession();

  // load user data for profile link
  // const { data: user } = trpc.useQuery(
  //   ['users.byAddress', { address: session?.user.address || '' }],
  //   {
  //     enabled: !!session?.user,
  //   }
  // );

  // create list of topTags and Techs for top-right sidebar
  // const topTagsTechs = useMemo(() => {
  //   if (tags && techs) {
  //     return tags
  //       .map((t) => ({ ...t, type: 'tag' }))
  //       .concat(techs.map((t) => ({ ...t, type: 'tech' })))
  //       .sort((a, b) => b._count.contents - a._count.contents)
  //       .slice(0, HOMEPAGE_COURSE_FILTERS);
  //   }
  // }, [tags, techs]);

  // load courses for courses section
  const { data: courses, isLoading: coursesLoading } = trpc.useQuery([
    'courses.all',
    { take: HOMEPAGE_COURSE_CAROUSEL },
  ]);

  // load projects for featured section
  const { data: projects, isLoading: projectsLoading } = trpc.useQuery([
    'projects.all',
    { take: HOMEPAGE_FEATURED_ITEMS },
  ]);
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
      <div className="grid h-[55vh] grid-cols-3">
        <div className="col-span-2 hidden h-full bg-[url('/homeBanner.png')] bg-cover md:block">
          <div className="space-y-3 px-8 pt-12">
            <p className="max-w-[80%] text-4xl leading-[2.8rem] text-secondary-400">
              A community endeavouring to guide those self-learning in Web3
            </p>
            <p className="text-4xl text-main-yellow">#GoYou</p>
          </div>
        </div>
        <div className="col-span-3 flex h-full items-center justify-center bg-main-yellow bg-[url('/homeBanner.png')] px-6 md:col-span-1 md:bg-[url('')]">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex w-full justify-between">
              <div className="flex max-w-[55%] flex-col justify-between">
                <p className="text-xl text-gray-300 md:text-black">
                  <span className="font-bold">
                    Track your self-learning progress
                  </span>{' '}
                  and show it ot the world through the{' '}
                  <span className="font-bold">soulbound token</span>
                </p>
                <div className="mt-3 flex items-center text-lg font-semibold">
                  <HiChevronRight className="text-2xl text-secondary-400" />
                  <p className="text-secondary-400">Learn More</p>
                </div>
              </div>
              <Image
                src="/images/sbt-frontpage.gif"
                alt="sbt"
                layout="intrinsic"
                width="175px"
                height="175px"
                className="block"
              />
            </div>
            <button className="btn-primary text-xl font-semibold leading-4 tracking-wide text-white">
              {' '}
              Minting now !
            </button>
          </div>
        </div>
      </div>
      <div className="px-[2.5rem] pt-8 lg:px-[5.5rem]">
        {/* Collection */}
        <div className="my-8">
          {/* First three collection */}
          <h4 className="text-2xl md:text-3xl lg:text-4xl">
            Community Spotlight
          </h4>
          <div className="md: grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* TODO : Handle error and improve logic */}
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
          {/* Next two collection */}
        </div>
      </div>
      <hr className="my-14 w-full bg-main-gray-dark" />
      <div className="gradient-bg-bottom px-[2.5rem]  pb-12 lg:px-[5.5rem]">
        {/* Top 10 courses */}
        <CourseCarousel
          title="Top 10 Courses"
          courses={courses}
          isLoading={coursesLoading}
        />
      </div>
      {/* View all resources  */}
      <div className="w-full space-y-4 bg-primary-400 px-8 py-5">
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
