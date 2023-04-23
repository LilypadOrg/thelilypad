import type { NextPage } from 'next';
import Image from 'next/image';
import CourseCarousel from '~/components/CourseCarousel';
import {
  HOMEPAGE_COURSE_CAROUSEL,
  HOMEPAGE_FEATURED_ITEMS,
} from '~/utils/constants';
import { api } from '~/utils/api';
import { SpotLightCards } from '~/components/ui/Home';
import { SpotLightCardsLoading } from '~/components/ui/Loaders';
import { HiChevronRight } from 'react-icons/hi';
import SectionTitle from '~/components/ui/SectionTitle';
import { useContentFilter } from '~/hooks/useContentFilter';
import { ContentType } from '~/types/types';
import BrowseCoursesLink from '~/components/BrowseCoursesLink';
import { useRef, useState } from 'react';

const Home: NextPage = () => {
  // load courses for courses section
  const { data: courses, isLoading: coursesLoading } = api.courses.all.useQuery(
    { take: HOMEPAGE_COURSE_CAROUSEL }
  );

  const [showContent, setShowContent] = useState<boolean>(false);
  // load projects for featured section
  const { data: projects, isLoading: projectsLoading } =
    api.projects.all.useQuery({ take: HOMEPAGE_FEATURED_ITEMS });

  const { techs, tags } = useContentFilter(ContentType.COURSE);
  const contentRef = useRef<HTMLDivElement>(null);

  const enableContent = () => {
    setShowContent(true);
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView(true);
      }
    }, 200);
  };

  return (
    <div>
      {/* Hero and cards */}
      <div className="grid h-[55vh] min-h-screen grid-cols-3">
        <div className="col-span-2 hidden h-full bg-[url('/homeBanner.png')] bg-cover md:block">
          <div className="space-y-3 px-8 pt-12">
            <div className="flex flex-col items-center gap-y-8 text-center">
              <h2 className="lie text-5xl leading-none sm:text-7xl lg:text-8xl">
                <span className="text-secondary-300">Join our</span>{' '}
                <span className=" bg-gradient-to-r from-primary-400 to-primary-400 bg-clip-text font-extrabold leading-none text-transparent">
                  Web3 Self LEarning
                </span>{' '}
                <span className="text-secondary-300">Community</span>
              </h2>
            </div>

            <div className="flex space-x-4">
              <button
                className="btn-primary rounded-xl text-lg font-semibold leading-4 tracking-wide text-white"
                onClick={enableContent}
              >
                Browse Content
              </button>
              <button
                className="btn-primary rounded-xl text-lg font-semibold leading-4 tracking-wide text-white"
                onClick={enableContent}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
        <div className="] col-span-3 flex h-full items-center justify-center bg-main-yellow bg-[url('/homeBanner.png')] px-6 md:col-span-1">
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

      <div ref={contentRef} className={`${showContent ? 'visible' : 'hidden'}`}>
        {/* Community Spotligh */}
        <div className="px-[2.5rem] pt-8 lg:px-[5.5rem]">
          <div className="my-8">
            {/* First three collection */}
            <SectionTitle title="Community Spotlight" />

            <div className="md: grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projectsLoading &&
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <SpotLightCardsLoading key={i} />
                ))}
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
          {/* view AllCourse one tab*/}
          {/* <div className="flex max-w-xs">
          <Link href={'/courses/'}>
            <button className="flex w-full items-center justify-between rounded-md bg-primary-300 py-2 px-4">
              <p>
                See all <span className="font-bold">courses</span>
              </p>
              <p className="mt-[0.1rem] text-xl font-bold">
                <HiChevronRight />
              </p>
            </button>
          </Link>
        </div> */}
        </div>
        <hr className="my-14 w-full bg-main-gray-dark" />
        {/* Browse all courses  */}
        <div className="w-full space-y-4  px-8 py-5">
          <SectionTitle title="Browse courses" />
          <div className="flex items-start space-x-4 xl:items-center">
            <div className="w-44 text-right font-semibold">
              Top technologies
            </div>
            <div>
              {techs && (
                <div className="grid justify-start  gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                  {techs
                    .sort((a, b) => b._count.contents - a._count.contents)
                    .map((courseFilter, i) => (
                      <>
                        {i <= 5 && (
                          <BrowseCoursesLink
                            key={`home-coursefilter-${courseFilter.slug}`}
                            courseFilterType="tech"
                            courseFilter={courseFilter}
                            className="w-full sm:w-44"
                          />
                        )}
                      </>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start space-x-4 xl:items-center">
            <div className="w-44 text-right font-semibold">Top Tags</div>
            <div>
              {tags && (
                <div className="grid justify-start  gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                  {tags
                    .sort((a, b) => b._count.contents - a._count.contents)
                    .map((courseFilter, i) => (
                      <>
                        {i <= 5 && (
                          <BrowseCoursesLink
                            key={`home-coursefilter-${courseFilter.slug}`}
                            courseFilterType="tag"
                            courseFilter={courseFilter}
                            className="w-full sm:w-44"
                          />
                        )}
                      </>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
