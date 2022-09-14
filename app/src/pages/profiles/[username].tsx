import { NextPage } from 'next';
import React from 'react';
import { limitStrLength } from '~/utils/formatters';
import { InfoTile, LearningPathCards } from '~/components/ui/userProfile';
import CompletedIcon from '~/components/ui/CompletedIcon';
import LevelPill from '~/components/ui/LevelPill';

const UserProfile: NextPage = () => {
  return (
    <div>
      <nav className="flex items-center justify-center space-x-10 border border-main-gray-dark">
        <p className="p-2">Event</p>
        <p className="p-2">Projects</p>
        <p className="p-2">Learning Path</p>
        <p className="p-2">Personal Roadmap</p>
      </nav>
      {/* Hero section */}
      <div className="my-8 flex items-center justify-center px-[5.5rem]">
        <div className="min-h-[255px] w-[38%] rounded-md bg-main-gray-light p-8 pl-12">
          <h1 className="text-2xl font-bold">Max Moon</h1>
          <p className="font-light">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita
            quis rem soluta maxime. Dolor qui inventore blanditiis nihil cum eum
            non ab dignissimos, incidunt aliquid ducimus iusto, quia possimus.
            Repudiandae, reprehenderit officiis!
          </p>
        </div>
        <div className="space-y-3 bg-main-gray-light">
          {/* Having hard time to use Image Component will fix this */}
          <img
            src="/images/profileSBT/frogSBT.png"
            alt="sbt"
            className="w-ful h-full"
          />
          <button className="w-full rounded-[6.5px] bg-primary-400 px-10 py-4 font-bold text-white">
            Mint Your SBT
          </button>
        </div>
        <div className="min-h-[255px] w-[38%] items-stretch rounded-md bg-main-gray-light p-8 pl-12">
          <h1 className="text-2xl font-bold">My Tech Stack</h1>
          <div className="grid grid-cols-3 gap-1">
            {languages.map((language) => (
              <LevelPill
                key={language}
                level={language}
                classes="justify-self-start"
              />
            ))}
          </div>
        </div>
      </div>
      {/* My Events */}
      <div className="mt-4 flex flex-col space-y-4 px-[5.5rem]">
        <h1 className="mb-0 text-3xl font-bold">My Events</h1>
        {events.map((event) => (
          <InfoTile
            key={event.id}
            title={event.title}
            tag={event.time}
            link={`/event/${event.id}`}
            linkTitle={'View Event'}
          />
        ))}
      </div>
      {/* My Projects */}
      <div className="my-10 flex flex-col space-y-4 px-[5.5rem]">
        <h1 className="mb-0 text-3xl font-bold">My Projects</h1>
        {projects.map((event) => (
          <InfoTile
            key={event.id}
            title={event.title}
            tag={event.time}
            link={`/event/${event.id}`}
            linkTitle={'View Event'}
          />
        ))}
      </div>
      {/* My Learning Path */}
      <div className="flex flex-col bg-main-gray-light px-[5.5rem] py-[2.2rem]">
        <h1 className="mb-1 text-3xl font-bold">My Learning Path</h1>
        <p className="w-[40%] font-light">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita
          quis rem soluta maxime. Dolor qui inventore .
        </p>
        <div className="mt-6 flex space-x-6">
          {paths.map((i) => (
            <LearningPathCards
              title="Intro into Web3 : basic steps"
              link={`/course/${i} `}
              linkTitle={'View all course'}
              img={`/images/frongLevels/l${i}.png`}
              key={i}
            />
          ))}
        </div>
      </div>
      {/* My personal roadmap */}
      <div className="flex flex-col px-[5.5rem] py-[2.2rem]">
        <h1 className="mb-1 text-3xl font-bold">My Personal Roadmap</h1>
        <p className="w-[40%] font-light">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita
          quis rem soluta maxime. Dolor qui inventore .
        </p>
      </div>
      {/* Beginner */}
      <div className="mt-14 flex justify-between border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex items-center space-x-14">
          <div className="flex items-center justify-between space-x-4">
            <CompletedIcon />
            <p className="text-md font-semibold leading-5 underline">
              Beginner 3/3
            </p>
          </div>
          <LevelPill
            level={'Completed on August 12 2022'}
            classes="bg-main-gray-light mt-2"
          />
        </div>
        <button className="rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
          More Beginner Roadmap
        </button>
      </div>
      {/* Intermediate */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex justify-between space-x-8">
          <div className="flex flex-col space-y-6">
            <p className="text-md font-semibold leading-5 underline">
              Intermediate 1/3
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              ipsam praesentium esse!
            </p>
            <button className="self-start rounded-md bg-main-gray-light px-12 py-2 font-semibold">
              Take final test
            </button>
          </div>
          <div className="mt-14 flex space-x-4">
            {interMediateCourses.map((course, i) => (
              /* Its same as CourseCard component */
              <div
                className="min-w-[20rem]  rounded-lg shadow-lg"
                key={`${course.title}-${i}`}
              >
                <div className="relative h-[182px]  w-full rounded-tr-lg rounded-tl-lg bg-main-gray-dark"></div>
                <div className="flex items-center space-x-3 px-4 pt-4">
                  {course.isCompleted && <CompletedIcon />}
                  <LevelPill level={course.level} classes="mt-2" />
                </div>
                <div className="flex flex-col justify-between px-4 py-3">
                  <div className="mb-2 text-lg font-bold">{course.title}</div>
                  <div className=" text-ellipsis text-base text-gray-700">
                    {limitStrLength(course.description, 80)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="ml-auto rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
          More Intermediate Roadmap
        </button>
      </div>
      {/* Advanced */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex justify-between space-x-8">
          <div className="flex flex-col space-y-6">
            <p className="text-md font-semibold leading-5 underline">
              Advanced 0/3
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              ipsam praesentium esse!
            </p>
            <button className="self-start rounded-md bg-main-gray-light px-12 py-2 font-semibold">
              Take final test
            </button>
          </div>
          <div className="mt-14 flex space-x-4">
            {interMediateCourses.map((course, i) => (
              /* Its same as CourseCard component */
              <div
                className="min-w-[20rem]  rounded-lg shadow-lg"
                key={`${course.title}-${i}`}
              >
                <div className="relative h-[182px]  w-full rounded-tr-lg rounded-tl-lg bg-main-gray-dark"></div>

                <div className="flex items-center space-x-3 px-4 pt-4">
                  <LevelPill level={'Advanced'} classes="mt-2" />
                </div>
                <div className="flex flex-col justify-between px-4 py-3">
                  <div className="mb-2 text-lg font-bold">{course.title}</div>
                  <div className=" text-ellipsis text-base text-gray-700">
                    {limitStrLength(course.description, 80)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="ml-auto rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
          More Intermediate Roadmap
        </button>
      </div>
    </div>
  );
};

const languages = ['javascript', 'solidity', 'react', 'c++', 'python'];

const interMediateCourses = [
  {
    level: 'intermediate',
    isCompleted: false,
    title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    level: 'intermediate',
    isCompleted: false,
    title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
  {
    level: 'intermediate',
    isCompleted: true,
    title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    description: 'Lorem ipsum dolor sit amet consectetur.',
  },
];

const paths = [1, 2, 3, 4, 5];

const events = [
  {
    title: 'Hackathon: 4 Vs 1 Who is the best...',
    id: '1',
    time: 'Sun 11 september 2022',
  },
  {
    title: 'Hackathon: 4 Vs 1 Who is the best...',
    id: '2',
    time: 'Sun 11 september 2022',
  },
];

const projects = [
  {
    title: 'Hackathon: 4 Vs 1 Who is the best...',
    id: 'a',
    time: 'Sun 11 september 2022',
  },
  {
    title: 'Hackathon: 4 Vs 1 Who is the best...',
    id: 'b',
    time: 'Sun 11 september 2022',
  },
  {
    title: 'Hackathon: 4 Vs 1 Who is the best...',
    id: 'c',
    time: 'Sun 11 september 2022',
  },
];

export default UserProfile;
