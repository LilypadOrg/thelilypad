import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import AddCourseToRoadmap from '~/components/AddCourseToRoadmap';
import { CompleteCourse } from '~/components/CompleteCourse';
import CourseCard from '~/components/CourseCard';
import LevelPill from '~/components/ui/LevelPill';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';
import { api } from '~/utils/api';
import { FaCogs } from 'react-icons/fa';
import { AiFillTags } from 'react-icons/ai';
import { MdGrade } from 'react-icons/md';
import { formatNumber } from '~/utils/formatters';

const CoursePage: NextPage = () => {
  const id = Number(useRouter().query.id);
  const { data: course, isLoading } = api.courses.byId.useQuery({ id });

  const { data: session } = useSession();

  const userCourse =
    course?.userCourses.length === 1 ? course?.userCourses[0] : undefined;

  const { data: relatedResources } = api.resources.related.useQuery(
    {
      tags: course?.content.tags.map((t) => t.slug),
      technologies: course?.content.technologies.map((t) => t.slug),
    },
    {
      enabled: !!course,
    }
  );

  const { data: relatedCourses } = api.courses.related.useQuery(
    {
      tags: course?.content.tags.map((t) => t.slug),
      technologies: course?.content.technologies.map((t) => t.slug),
      excludeCourseId: course?.id,
    },
    {
      enabled: !!course,
    }
  );

  // TODO: pull rigght content
  // const project = projects?.find((p) => p.id === 30003);

  if (isLoading) {
    return (
      <div className="gradient-bg-top px-[5.5rem]">
        <div className="flex animate-pulse flex-col py-8">
          <h1 className="mb-2 w-[30%] rounded-md bg-gray-400 text-4xl font-bold text-transparent">
            RandomText
          </h1>
        </div>
        {/* hero image */}
        <div className="relative flex h-[200px] w-full animate-pulse items-center justify-center rounded-md bg-main-gray-dark sm:h-[300px] md:h-[400px] lg:h-[600px]"></div>
      </div>
    );
  }

  return course ? (
    <div>
      <div className="gradient-bg-top-course px-[5.5rem]">
        <div className="flex flex-col py-8 ">
          <h1 className="mb-4 text-4xl font-bold">{course.content.title}</h1>
        </div>
        {/* hero image */}
        <div className="relative flex h-[200px] w-full items-center justify-center rounded-md bg-main-gray-light sm:h-[300px] md:h-[400px] lg:h-[600px]">
          {course.content.coverImageUrl && (
            <Link className="cursor-pointer" href={course.content.url}>
              <a target="_blank">
                <Image
                  alt="thumbnail"
                  src={course.content.coverImageUrl}
                  layout="fill"
                  objectFit="contain"
                />
              </a>
            </Link>
          )}
          {/* play button */}
          {/* <div className="h-14 w-14 rounded-full bg-secondary-400 shadow-md"></div> */}
        </div>
        <div className="mt-4 flex gap-x-4">
          <div className="flex gap-x-2">
            <MdGrade className="text-2xl text-secondary-500" />
            {course.levels.map((t) => (
              <LevelPill
                key={`course-tech-${t.id}`}
                level={t.name}
                url={`/courses/browse/level/${t.slug}`}
              />
            ))}
          </div>
          <div className="flex gap-x-2">
            <FaCogs className="text-2xl text-secondary-500" />
            {course.content.technologies.map((t) => (
              <LevelPill
                key={`course-tech-${t.id}`}
                level={t.name}
                url={`/courses/browse/tech/${t.slug}`}
              />
            ))}
          </div>
          <div className="flex gap-x-2">
            <AiFillTags className="text-2xl text-secondary-500" />
            {course.content.tags.map((t) => (
              <LevelPill
                key={`course-tech-${t.id}`}
                level={t.name}
                url={`/courses/browse/tag/${t.slug}`}
              />
            ))}
          </div>
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
          <div className="flex flex-col space-y-6">
            <h1 className="mb-0 text-3xl font-semibold">Awards</h1>
            <div className="flex justify-center">
              <div className="grid w-[75%] grid-cols-3 gap-4">
                <div className="flex flex-col gap-4 bg-gray-200 p-4 text-center">
                  <p className="text-xl font-bold">XP</p>
                  <div className="flex h-full items-center justify-center rounded-sm bg-gray-400">
                    <p className="text-4xl">{formatNumber(course.xp)}</p>
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-4 bg-gray-200 p-4 text-center">
                  <p className="text-xl font-bold">Accolades</p>
                  <div className="flex h-full items-center justify-center gap-x-4 rounded-sm bg-gray-400 py-2">
                    <Image
                      alt="badge"
                      src="/images/badges/badge.png"
                      layout="fixed"
                      width="120px"
                      height="150px"
                      className=""
                    />
                    <p className="text-4xl">[Whew...you made it!]</p>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="mb-0 text-3xl font-semibold">Description</h1>
            <p className="font-light">{course.content.description}</p>
            {session && (
              <div className="grid grid-cols-2 gap-4">
                <AddCourseToRoadmap
                  courseId={course.id}
                  inRoadmap={userCourse?.roadmap || false}
                  type="standard"
                />
                {userCourse?.lastTestPassed || false ? (
                  <CompleteCourse
                    courseId={course.id}
                    user={session.user}
                    completed={userCourse?.completed || false}
                  />
                ) : (
                  <button className="mt-8 rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500">
                    <Link href={`/tests/${id}`}>Take final test</Link>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Course Carousel */}
      {/* 
      <div className="bg-main-gray-light pt-2 pb-4">
        <div className="px-[5.5rem]">
          <CourseCarousel title={`Top 10 ${topic} Courses`} courses={courses} />
        </div>
      </div> */}

      {/* Related courses */}
      <div className="px-[5.5rem]">
        {/* header */}
        <div className="flex flex-col py-8">
          <h1 className="mt-8 text-4xl">Related Courses</h1>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {relatedCourses?.map((course) => (
            <CourseCard key={`related-courses-${course.id}`} course={course} />
          ))}
        </div>
        {/* show more */}
        {relatedCourses?.length === BROWSE_COURSES_ITEMS && (
          <div className="my-10 w-full bg-main-gray-light py-2 text-center text-xl font-medium">
            Show More Courses
          </div>
        )}
      </div>

      {/* Related resources */}
      <div className="gradient-bg-bottom px-[5.5rem] pb-14">
        <div className="my-10 w-full space-y-4">
          <h1 className="mt-8 text-4xl">Related Resources</h1>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {relatedResources?.map((res) => (
              <Link
                href={`/resources/${res.id}/${res.slug}`}
                key={`related-resources-${res.id}`}
              >
                <button className="flex w-full items-center justify-between rounded-md bg-primary-300 py-2 px-4">
                  <p className="self-start">{res.title}</p>
                </button>
              </Link>
            ))}
          </div>
        </div>
        {/* <div className="mt-8 flex flex-col">
          <h1 className="text-4xl">Something about the community</h1>
          <div className="flex space-x-8">
            <div className="relative min-h-[353px] min-w-[51.2%] rounded-sm border-[0.15rem] border-primary-600 bg-primary-600 text-white ">
              {project?.content.coverImageUrl && (
                <Image
                  src={`${PROJECTS_IMAGE_PATH}${project.content.coverImageUrl}`}
                  alt="community project thumbnail"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-sm transition-all hover:scale-95"
                />
              )}
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="font-bold">{project?.content.title}</h4>
              <p className="font-[350]">{project?.content.description}</p>
              <div className="flex justify-between rounded-md bg-main-gray-light py-2 px-4">
                <p>Go somewhere else</p>
                <p className="font-normal">&#62;</p>
              </div>
            </div>
          </div>
        </div> */}
        {/* TITLE AND IMAGE */}
        <div className="mb-8 flex flex-col">
          <h1 className="text-2xl md:text-3xl lg:text-4xl">
            {' '}
            Even I suck at titles
          </h1>
          <div className="flex flex-col space-y-4  lg:flex-row lg:space-x-8 lg:space-y-0">
            <div className="min-h-[200px]  min-w-[60%] rounded-sm  bg-main-gray-dark text-white lg:min-h-[353px]"></div>
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
              <div className="mb-6 flex justify-between rounded-md bg-primary-300 py-2 px-4 lg:mb-0">
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
