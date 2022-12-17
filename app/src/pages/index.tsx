import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CourseCarousel from '~/components/CourseCarousel';
import { ContentType } from '~/types/types';
import {
  HOMEPAGE_COURSE_CAROUSEL,
  HOMEPAGE_COURSE_FILTERS,
  HOMEPAGE_FEATURED_ITEMS,
} from '~/utils/constants';
import { trpc } from '~/utils/trpc';
import { useSession } from 'next-auth/react';
import { SpotLightCards } from '~/components/ui/Home';
import { SpotLightCardsLoading, StripLoading } from '~/components/ui/Loaders';
import { HiChevronRight } from 'react-icons/hi';
import AboutHomeLinks from '~/components/AboutHomeLinks';
import BrowseCoursesLink from '~/components/BrowseCoursesLink';
import { useMemo } from 'react';

const Home: NextPage = () => {
  // Load techs for side bar links - top tags and techs
  const { data: techs, isLoading: techsLoading } = trpc.useQuery([
    'technologies.byContentTYpe',
    { contentType: ContentType.COURSE },
  ]);

  // Load tags for side bar links - top tags and techs
  const { data: tags, isLoading: tagsLoading } = trpc.useQuery([
    'tags.byContentTYpe',
    { contentType: ContentType.COURSE },
  ]);

  const { data: session } = useSession();

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

  // load user data for profile link
  const { data: user } = trpc.useQuery(
    ['users.byAddress', { address: session?.user.address || '' }],
    {
      enabled: !!session?.user,
    }
  );

  // create list of topTags and Techs for top-right sidebar
  const topTagsTechs = useMemo(() => {
    if (tags && techs) {
      return tags
        .map((t) => ({ ...t, type: 'tag' }))
        .concat(techs.map((t) => ({ ...t, type: 'tech' })))
        .sort((a, b) => b._count.contents - a._count.contents)
        .slice(0, HOMEPAGE_COURSE_FILTERS);
    }
  }, [tags, techs]);

  return (
    <div>
      {/* Hero and cards */}
      <div className="grid h-[55vh] grid-cols-3">
        <div className="col-span-2 h-full bg-[url('/homeBanner.png')] bg-cover">
          <div className="space-y-3 px-8 pt-12">
            <p className="max-w-[80%] text-4xl leading-[2.8rem] text-secondary-400">
              A community endeavouring to guide those self-learning in Web3
            </p>
            <p className="text-4xl text-main-yellow">#GoYou</p>
          </div>
        </div>
        <div className="flex h-full items-center justify-center bg-main-yellow px-6">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex w-full justify-between">
              <div className="flex max-w-[55%] flex-col justify-between">
                <p className="text-xl">
                  <span className="font-bold">
                    Track your self-learning progress
                  </span>{' '}
                  and show it ot the world through the{' '}
                  <span className="font-bold">soulbound token</span>
                </p>
                <div className="flex items-center text-lg font-semibold">
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
        <div className="grid grid-cols-3 gap-8">
          {/* Home Image and below container */}
          {/* <div className="col-span-3 flex flex-col space-y-4 lg:col-span-2 ">
            <div className="relative min-h-[250px] rounded-lg bg-main-gray-dark text-white lg:min-h-[353px]">
              <Image
                src="/images/homeBanner.jpg"
                alt="Home banner"
                layout="fill"
                priority
                objectFit="cover"
                objectPosition={'left left'}
                className="rounded-lg"
              />
              <div className=" absolute bottom-4 right-4 max-w-[50%] space-y-2 rounded-lg bg-primary-400 p-4 lg:max-w-[25%]">
                <h1 className="mb-0 text-sm lg:text-lg">The Lily Pad</h1>
                <p className="text-xs font-light leading-[1.1] lg:text-sm">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-xs font-light lg:text-sm">#goForYou</p>
              </div>
            </div>
            <AboutHomeLinks />
          </div> */}
          {/* Side List */}
          {/* <div className="hidden h-full rounded-lg bg-main-gray-light py-5 px-6 lg:block">
            <div className="mt-6">
              <h1 className="mb-0 text-2xl">Courses</h1>
              <p className="text-sm">
                Become a real dev not just a fake one, we have evrything you
                need to be the best you can be
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="courses">
                <button className="col-span-2 flex items-center justify-between rounded-md bg-white py-2 px-4">
                  <p className="">All Courses</p>
                  <p className="mt-[0.1rem] text-xl font-bold">
                    <HiChevronRight />
                  </p>
                </button>
              </Link>

              {tagsLoading && techsLoading
                ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <StripLoading key={i} />)
                : topTagsTechs?.map((courseFilter) => (
                    <BrowseCoursesLink
                      key={`home-coursefilter-${courseFilter.slug}`}
                      courseFilter={courseFilter}
                      courseFilterType={courseFilter.type}
                    />
                  ))}
            </div>
            <div className="mt-4 flex gap-x-4 rounded-lg bg-gray-300 p-2">
              <Image
                src="/images/sbt-frontpage.gif"
                alt="sbt"
                layout="intrinsic"
                width="300px"
                height="300px"
                className="rounded-lg"
              />
              <div className="flex flex-col justify-between gap-y-2">
                <div>
                  <p className="text-lg font-semibold">Mint your SBT</p>
                  <p>Track your self-learning progress</p>
                </div>
                {user && (
                  <Link href={`/profiles/${user.username}`}>
                    <a className="mb-2 underline">
                      <p>Go to profile</p>
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div> */}
        </div>
        {/* Collection */}
        {/* TODO  Add title */}
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
        {/* view AllCourse one tab*/}
        <div className="mt-14 w-full">
          <div className="flex justify-between rounded-md bg-main-gray-light px-4 py-2 lg:w-[30%] lg:py-2">
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

        {/* View all resources  */}
        {/* <div className="my-10 w-full space-y-4">
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
        </div> */}
      </div>
    </div>
  );
};

export default Home;
