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
      <div className="gradient-bg-top px-[5.5rem] pt-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 flex flex-col space-y-4 ">
            {/* Hero Image */}
            <div className="relative min-h-[353px]  rounded-lg bg-main-gray-dark text-white">
              <Image
                src="/images/homeBanner.jpg"
                alt="Home banner"
                layout="fill"
                priority
                objectFit="cover"
                className="rounded-lg"
              />
              <div className=" absolute bottom-4 right-4 max-w-[25%] space-y-2 rounded-lg bg-primary-400 p-4">
                <h1 className="mb-0 text-lg">The Lily Pad</h1>
                <p className="text-sm font-light leading-[1.1]">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-sm font-light">#goForYou</p>
              </div>
            </div>
            {/* we help you grow */}
            <AboutHomeLinks />
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
                    /* Needs to be abstracted */
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
          </div>
        </div>
        {/* Collection */}
        <div className="my-8">
          {/* First three collection */}
          <div className="grid grid-cols-3 gap-8">
            {/* TODO : Handle error and improve logic */}
            {projectsLoading &&
              [1, 2, 3, 4, 5, 6].map((i) => <SpotLightCardsLoading key={i} />)}
            {projects?.map((p, index: number) => (
              <SpotLightCards
                key={p.id}
                teal={Boolean(index % 2)}
                title={p.content.title}
                description={p.content.description}
                coverImageUrl={p.content.coverImageUrl}
              />
            ))}
          </div>
          {/* Next two collection */}
        </div>
      </div>
      <hr className="my-14 w-full bg-main-gray-dark" />
      <div className="gradient-bg-bottom px-[5.5rem] pb-12">
        {/* Top 10 courses */}
        <CourseCarousel
          title="Top 10 Courses"
          courses={courses}
          isLoading={coursesLoading}
        />
        {/* view AllCourse one tab*/}
        <div className="mt-14 w-full">
          <div className="flex w-[30%] justify-between rounded-md bg-main-gray-light py-2 px-4">
            <Link href="courses">
              <button className="col-span-2 flex items-center justify-between rounded-md py-2 px-4">
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
