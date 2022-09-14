import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import LevelPill from '../../components/ui/LevelPill';

const languages = ['javascript', 'solidity', 'react', 'c++', 'python'];

const InfoTile = ({
  title,
  tag,
  linkTitle,
  link,
}: {
  title: string;
  tag: string;
  linkTitle: string;
  link: string;
}) => {
  return (
    <div className="flex items-center justify-between  rounded-md border-2 border-main-gray-light py-3 px-4">
      <div className="space-y-1">
        <p className="text-lg font-bold">{title}</p>
        <LevelPill level={tag} classes="bg-main-gray-light" />
      </div>
      <Link href={link}>
        <a className="text-blue self-end underline">{linkTitle}</a>
      </Link>
    </div>
  );
};

const LearningPathCards = ({
  title,
  img,
  linkTitle,
  link,
}: {
  title: string;
  img: string;
  linkTitle: string;
  link: string;
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between space-x-4">
        <div className="h-6 w-8 rounded-full bg-green-600"></div>
        <p className="text-md font-semibold leading-5">{title}</p>
      </div>
      <div className="my-4 h-24">
        <Image src={img} alt="froggy" height={'100%'} width={'100%'} />
      </div>
      <Link href={link} className="">
        {linkTitle}
      </Link>
    </div>
  );
};

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
          <Image
            src="/images/profileSBT/frogSBT.png"
            alt="sbt"
            layout="intrinsic"
            objectFit="contain"
            width={500}
            height={300}
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
    </div>
  );
};

export default UserProfile;
