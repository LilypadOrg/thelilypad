import type { NextPage } from 'next';
import CourseCard from '~/components/CourseCard';
import CourseCarousel from '~/components/CourseCarousel';

const courseData = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
];

const bigResourceList = [...coursesList];

const CourseCategories: NextPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col py-8 px-[5.5rem]">
        <h1 className="mb-4 text-5xl font-bold">
          So You want to learn Solidity
        </h1>
        <p className="max-w-lg font-light">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat
          suscipit.
        </p>
      </div>
      {/* Course Carousel */}
      <div className="bg-main-gray-light pt-2 pb-4">
        <div className="px-[5.5rem]">
          <CourseCarousel title="Top 10 Solidity Courses" />
        </div>
      </div>
      {/* Course Grid */}
      <div className="px-[5.5rem]">
        {/* header */}
        <div className="flex flex-col py-8">
          <h1 className="mb-4 text-4xl font-bold">
            So You want to learn Solidity
          </h1>
          <p className="max-w-lg font-light">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat
            suscipit.
          </p>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-3 gap-6">
          {courseData.map((data) => (
            <CourseCard key={data} />
          ))}
        </div>
        {/* show more */}
        <div className="my-10 w-full bg-main-gray-light py-2 text-center text-xl font-medium">
          Show More Courses
        </div>
        {/* Other Categories */}
        <div className="my-10 w-full space-y-4">
          <h1 className="mt-8 text-4xl">Other Categories</h1>
          <div className="grid grid-cols-3 gap-4">
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
