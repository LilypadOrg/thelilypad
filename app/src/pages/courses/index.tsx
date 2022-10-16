import { NextPage } from 'next';
import React, { useState } from 'react';
import BrowseCoursesLink from '~/components/BrowseCoursesLink';
import CourseCarousel from '~/components/CourseCarousel';
import { CourseCardLoading } from '~/components/ui/Loaders';
import { useContentFilter } from '~/hooks/useContentFilter';
import { ContentType } from '~/types/types';
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

const Courses: NextPage = () => {
  const filterTags = ['web2', 'web3'];
  const [showMoreTechs, setShowMoreTechs] = useState<boolean>(false);

  const {
    techs,
    tags,
    levels,
    isLoading: filtersLoading,
  } = useContentFilter(ContentType.COURSE);

  const carouselsTags = tags?.filter((t) => filterTags.includes(t.slug));

  const { data: courses, isLoading: coursesLoading } = trpc.useQuery([
    'courses.all',
  ]);

  return (
    <div className="gradient-bg-top-courses px-[5.5rem] pt-2">
      <h3 className="mb-2 mt-2">Courses</h3>
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-3">
          {(filtersLoading || coursesLoading) && <Loader />}
          {carouselsTags &&
            courses &&
            carouselsTags.map((t) => {
              const filteredCourses = courses.filter(
                (c) => !!c.content.tags.find((t2) => t2.slug === t.slug)
              );
              if (filteredCourses)
                return (
                  <div key={`courses-tag-${t}`}>
                    <CourseCarousel
                      title={`${t.name} courses`}
                      courses={filteredCourses}
                      isLoading={filtersLoading && coursesLoading}
                    />
                  </div>
                );
            })}
        </div>
        {/* Aside */}
        <div className="mt-8 flex flex-col gap-4">
          <h4>Browse courses</h4>
          <h6>Level</h6>
          {levels && (
            <div>
              {levels.map((courseFilter) => (
                /* Needs to be abstracted */
                <BrowseCoursesLink
                  key={`home-coursefilter-${courseFilter.slug}`}
                  courseFilterType="level"
                  courseFilter={courseFilter}
                />
              ))}
            </div>
          )}
          <h6>Technology</h6>
          {techs && (
            <div>
              {techs
                .sort((a, b) => b._count.contents - a._count.contents)
                .map((courseFilter, i) => (
                  <>
                    {i <= 4 && (
                      <BrowseCoursesLink
                        key={`home-coursefilter-${courseFilter.slug}`}
                        courseFilterType="tech"
                        courseFilter={courseFilter}
                      />
                    )}
                    {i > 4 && (
                      <div className={`${showMoreTechs ? 'block' : 'hidden'}`}>
                        <BrowseCoursesLink
                          key={`home-coursefilter-${courseFilter.slug}`}
                          courseFilterType="tech"
                          courseFilter={courseFilter}
                        />
                      </div>
                    )}
                  </>
                ))}
              {techs.length > 5 && (
                <div className="mt-2 text-right">
                  <button onClick={() => setShowMoreTechs((val) => !val)}>
                    Show {showMoreTechs ? 'Less' : 'More'} Options
                  </button>
                </div>
              )}
            </div>
          )}
          <h6>Tag</h6>
          {tags && (
            <div>
              {tags
                .sort((a, b) => b._count.contents - a._count.contents)
                .map((courseFilter, i) => (
                  <>
                    {i <= 4 && (
                      <BrowseCoursesLink
                        key={`home-coursefilter-${courseFilter.slug}`}
                        courseFilterType="tag"
                        courseFilter={courseFilter}
                      />
                    )}
                    {i > 4 && (
                      <div className={`${showMoreTechs ? 'block' : 'hidden'}`}>
                        <BrowseCoursesLink
                          key={`home-coursefilter-${courseFilter.slug}`}
                          courseFilterType="tech"
                          courseFilter={courseFilter}
                        />
                      </div>
                    )}
                  </>
                ))}
              {tags.length > 5 && (
                <div className="mt-2 text-right">
                  <button onClick={() => setShowMoreTechs((val) => !val)}>
                    Show {showMoreTechs ? 'Less' : 'More'} Options
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* checkbox filters, multiple selection */}
        {/* <div className="flex flex-col gap-10">
          <h5>Filters</h5>
          <div className="flex flex-col gap-6">
            {techs && (
              <ContentFilter
                filterName="Technology"
                filterKey="technologies"
                filterOptions={techs}
                filterValues={contentFilters.technologies}
                updateFilter={updateFilter}
              />
            )}
            {levels && (
              <ContentFilter
                filterName="Level"
                filterKey="levels"
                filterOptions={levels}
                filterValues={contentFilters.levels}
                updateFilter={updateFilter}
              />
            )}
            {tags && (
              <ContentFilter
                filterName="Tags"
                filterKey="tags"
                filterOptions={tags}
                filterValues={contentFilters.tags}
                updateFilter={updateFilter}
              />
            )}
          </div>
        </div> */}

        {/* <div className="flex flex-col gap-10">
          <h1 className="mt-8 text-4xl">Top courses</h1>
          {coursesLoading &&
            [1, 2, 3, 4].map((i) => <CourseCardLoading key={i} />)}
          {courses?.slice(0, COURSES_HOME_ITEMS).map((c) => (
            <CourseCard key={`courses-${c.id}`} course={c} />
          ))}
        </div> */}

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
