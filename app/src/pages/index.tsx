import type { NextPage } from 'next';
import CourseCarousel from '~/components/CourseCarousel';
import {
  HOMEPAGE_COURSE_CAROUSEL,
  HOMEPAGE_FEATURED_ITEMS,
} from '~/utils/constants';
import { api } from '~/utils/api';
import { SpotLightCards } from '~/components/ui/Home';
import { SpotLightCardsLoading } from '~/components/ui/Loaders';
import SectionTitle from '~/components/ui/SectionTitle';
import { useContentFilter } from '~/hooks/useContentFilter';
import { ContentType } from '~/types/types';
import BrowseCoursesLink from '~/components/BrowseCoursesLink';
import { useRef } from 'react';
import HomeHero from '~/components/HomeHero';

const Home: NextPage = () => {
  // load courses for courses section
  const { data: courses, isLoading: coursesLoading } = api.courses.all.useQuery(
    { take: HOMEPAGE_COURSE_CAROUSEL }
  );

  // const [showContent, setShowContent] = useState<boolean>(false);
  // load projects for featured section
  const { data: projects, isLoading: projectsLoading } =
    api.projects.all.useQuery({ take: HOMEPAGE_FEATURED_ITEMS });

  const { techs, tags } = useContentFilter(ContentType.COURSE);
  const contentRef = useRef<HTMLDivElement>(null);

  // const enableContent = () => {
  //   setShowContent(true);
  //   setTimeout(() => {
  //     if (contentRef.current) {
  //       contentRef.current.scrollIntoView(true);
  //     }
  //   }, 200);
  // };

  return (
    <div>
      {/* Hero and cards */}
      <HomeHero scrollToRef={contentRef} />

      <div ref={contentRef} className={` mx-auto`}>
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
