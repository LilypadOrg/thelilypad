import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HiChevronRight } from 'react-icons/hi';
import CourseCard from '~/components/CourseCard';
import CourseCarousel from '~/components/CourseCarousel';
import { CourseCardLoading } from '~/components/ui/Loaders';
import { ContentType } from '~/types/types';
import {
  BROWSE_COURSES_CAT_FILTERS,
  BROWSE_COURSES_ITEMS,
} from '~/utils/constants';
import { trpc } from '~/utils/trpc';

const CourseCategories: NextPage = () => {
  const router = useRouter();

  const { type, slug } = router.query;

  const { data: courses, isLoading: coursesLoading } = trpc.useQuery([
    'courses.all',
    {
      tags: type === 'tag' ? slug : undefined,
      technologies: type === 'tech' ? slug : undefined,
      levels: type === 'level' ? slug : undefined,
    },
  ]);

  const { data: tagTitle } = trpc.useQuery(
    ['tags.bySlug', { slug: Array.isArray(slug) ? slug[0] : slug || '' }],
    {
      enabled: !!slug && type === 'tag',
    }
  );

  const { data: techTitle } = trpc.useQuery(
    [
      'technologies.bySlug',
      { slug: Array.isArray(slug) ? slug[0] : slug || '' },
    ],
    {
      enabled: !!slug && type === 'tech',
    }
  );

  const { data: levelTitle } = trpc.useQuery(
    [
      'courseLevels.bySlug',
      { slug: Array.isArray(slug) ? slug[0] : slug || '' },
    ],
    {
      enabled: !!slug && type === 'level',
    }
  );

  const { data: techs } = trpc.useQuery([
    'technologies.byContentTYpe',
    { contentType: ContentType.COURSE },
  ]);
  const { data: tags } = trpc.useQuery([
    'tags.byContentTYpe',
    { contentType: ContentType.COURSE },
  ]);

  const topic = tagTitle?.name || techTitle?.name || levelTitle?.name || '';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col py-8 px-[5.5rem]">
        <h1 className="mb-4 text-5xl font-bold">
          {type !== 'level'
            ? `So You want to learn ${topic}`
            : `${topic} Courses`}
        </h1>
        <p className="max-w-lg font-light">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat
          suscipit.
        </p>
      </div>
      {/* Course Carousel */}
      <div className="bg-main-gray-light pt-2 pb-4">
        <div className="px-[5.5rem]">
          <CourseCarousel
            title={`Top 10 ${topic} Courses`}
            courses={courses}
            isLoading={coursesLoading}
          />
        </div>
      </div>
      {/* Course Grid */}
      <div className="px-[5.5rem]">
        {/* header */}
        <div className="flex flex-col py-8">
          <h1 className="mb-4 text-4xl font-bold">
            {type !== 'level'
              ? `So You want to learn ${topic}`
              : `${topic} Courses`}
          </h1>
          <p className="max-w-lg font-light">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat
            suscipit.
          </p>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* TODO : Handle error and improve logic */}
          {coursesLoading &&
            [1, 2, 3, 4, 5].map((i) => <CourseCardLoading key={i} />)}
          {courses?.map((data) => (
            <CourseCard key={`course-${data.id}`} course={data} />
          ))}
        </div>
        {/* show more */}
        {/* TODO: manage pagination properly */}
        {courses?.length === BROWSE_COURSES_ITEMS && (
          <div className="my-10 w-full bg-main-gray-light py-2 text-center text-xl font-medium">
            Show More Courses
          </div>
        )}
        {/* Other Categories */}
        <div className="my-10 w-full space-y-4">
          <h1 className="mt-8 text-4xl">Other Categories</h1>
          <div className="grid grid-cols-3 gap-4">
            {tags &&
              techs &&
              tags
                .map((t) => ({ ...t, type: 'tag' }))
                .concat(techs.map((t) => ({ ...t, type: 'tech' })))
                .filter((t) => t.slug !== slug)
                .sort((a, b) => b._count.contents - a._count.contents)
                .slice(0, BROWSE_COURSES_CAT_FILTERS)
                .map((courseFilter) => (
                  <Link
                    href={`/courses/browse/${courseFilter.type}/${courseFilter.slug}`}
                    key={`home-coursefilter-${courseFilter.slug}`}
                  >
                    <button className="flex items-center justify-between rounded-md bg-main-gray-light py-2 px-4">
                      <p className="">
                        {courseFilter.name} ({courseFilter._count.contents})
                      </p>
                      <p className="mt-[0.1rem] text-xl font-bold">
                        <HiChevronRight />
                      </p>
                    </button>
                  </Link>
                ))}
          </div>
        </div>
        {/* Event I suck at titles */}
        <div className="flex flex-col">
          <h1 className="text-4xl"> Even I suck at titles</h1>
          <div className="flex space-x-8">
            <div className="min-h-[353px] min-w-[60%]  rounded-lg bg-main-gray-dark text-white"></div>
            <div className="flex flex-col space-y-4">
              <p className="font-semibold">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aspernatur ab ratione vel. Lorem ipsum dolor sit amet
                consectetur.
              </p>
              <p className="font-[350]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae, eligendi! Sit maiores corporis, nobis obcaecati
                tempore deserunt vel cum labore eum nostrum. Ratione porro dolor
                cum quo deleniti quis iusto?Lorem ipsum, dolor sit amet
                consectetur adipisicing elit. Saepe quibusdam tempore aliquid
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
  );
};

export default CourseCategories;
