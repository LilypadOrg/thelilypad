import Image from 'next/image';
import React from 'react';
import { Course } from '~/types/types';
import { formatNumber, limitStrLength } from '~/utils/formatters';
import LevelPill from './ui/LevelPill';
import AddCourseToRoadmap from './AddCourseToRoadmap';
import { BsCheck2 } from 'react-icons/bs';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const CourseCard = ({
  course,
  type = 'full',
  actions = true,
}: {
  course: Course;
  type?: 'full' | 'simple';
  actions?: boolean;
}) => {
  const { data: session } = useSession();

  // each course has a userCourse array, but it's empty if the user is not logged in]
  // each course only has one userCourse, so we can access it with [0]
  const completed = course.userCourses[0]?.completed;
  const inRoadmap = course.userCourses[0]?.roadmap;

  return (
    // TODO: remove fix heigth
    <div
      className={`flex lg:min-w-[20rem] ${
        type === 'simple' && 'max-w-[20rem]'
      } relative flex-col justify-between self-start rounded-sm shadow-lg ${
        type === 'full' ? 'min-h-[400px]' : 'min-h-[350px]'
      } bg-white`}
    >
      <div className="flex flex-col justify-start">
        <div className="rounded-tl-smg relative h-[120px] w-full rounded-tr-sm bg-dark-blue lg:h-[182px]">
          <Link href={`/courses/${course.id}/${course.content.slug}`}>
            <a>
              {course.content.coverImageUrl && (
                <Image
                  src={course.content.coverImageUrl}
                  alt="Course thumbnail"
                  layout="fill"
                  objectFit="contain"
                />
              )}
            </a>
          </Link>
          <div className=" absolute bottom-2 right-2 flex items-center gap-x-2 rounded-sm border-2 border-primary-900 bg-primary-700 p-1 font-semibold text-secondary-300">
            <div>
              <svg
                width="30"
                height="30"
                viewBox="0 0 500 500"
                fill="black"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M250 480C377.025 480 480 377.025 480 250C480 122.975 377.025 20 250 20C122.975 20 20 122.975 20 250C20 377.025 122.975 480 250 480ZM250 500C388.071 500 500 388.071 500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500Z"
                  fill="#83DAD6"
                />
                <path
                  d="M155.477 177.545L184.81 227.119H185.946L215.421 177.545H250.151L205.761 250.273L251.145 323H215.776L185.946 273.355H184.81L154.98 323H119.753L165.278 250.273L120.605 177.545H155.477Z"
                  fill="#83DAD6"
                />
                <path
                  d="M269.611 323V177.545H326.997C338.029 177.545 347.428 179.652 355.193 183.866C362.958 188.033 368.877 193.833 372.949 201.267C377.068 208.653 379.128 217.176 379.128 226.835C379.128 236.494 377.045 245.017 372.878 252.403C368.711 259.79 362.674 265.543 354.767 269.662C346.907 273.781 337.39 275.841 326.216 275.841H289.639V251.196H321.244C327.163 251.196 332.04 250.178 335.875 248.142C339.758 246.059 342.646 243.194 344.54 239.548C346.481 235.855 347.452 231.617 347.452 226.835C347.452 222.006 346.481 217.792 344.54 214.193C342.646 210.547 339.758 207.73 335.875 205.741C331.993 203.705 327.068 202.687 321.102 202.687H300.364V323H269.611Z"
                  fill="#83DAD6"
                />
              </svg>
            </div>
            <p>{formatNumber(course.xp)}</p>
          </div>
        </div>

        {type === 'full' && (
          <div className="flex items-start justify-between px-4 pt-4 pb-2">
            <div>
              {course.levels.map((l) => (
                <LevelPill key={`course-${course.id}-${l.id}`} level={l.name} />
              ))}
            </div>
          </div>
        )}

        <div className=" px-4 pt-0 pb-2">
          <div className="mb-2 overflow-hidden  whitespace-nowrap text-[.885rem] font-bold lg:text-lg">
            <Link href={`/courses/${course.id}/${course.content.slug}`}>
              {limitStrLength(course.content.title, 80)}
            </Link>
          </div>
          {type === 'full' && (
            <div className=" text-ellipsis text-base text-gray-700">
              {limitStrLength(course.content.description, 80)}
            </div>
          )}
        </div>
      </div>
      {session && actions && (
        <div className="mb-2 mr-2 flex items-center justify-end gap-x-2">
          {completed && (
            <div className="rounded-full border-2 bg-green-600 p-2  text-lg text-white">
              <BsCheck2 />
            </div>
          )}

          <AddCourseToRoadmap
            courseId={course.id}
            inRoadmap={inRoadmap}
            type="small"
          />
        </div>
      )}
    </div>
  );
};

export default CourseCard;
