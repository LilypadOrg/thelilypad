import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import LevelPill from '../../components/ui/LevelPill';
import { toast } from 'react-toastify';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useQuery,
  useWaitForTransaction,
} from 'wagmi';
import { trpc } from '~/utils/trpc';
import {
  MAIN_CONTRACT_ADDRESS,
  MAIN_CONTRACT_ABI,
  SBT_CONTRACT_ADDRESS,
  SBT_CONTRACT_ABI,
} from '~/utils/contracts';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { SBT_MINT_FEE } from '~/utils/constants';
import { FaEdit, FaLock } from 'react-icons/fa';
import { formatAddress, limitStrLength } from '~/utils/formatters';
import EditProfileModal from '~/components/EditProfileModal';
import CompletedIcon from '~/components/ui/CompletedIcon';

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

const UserProfile: NextPage = () => {
  const { data: session } = useSession();
  const [newUsername] = useState<string>('');
  const utils = trpc.useContext();
  const router = useRouter();
  const username = router.query.username as string | undefined;

  const { data: userProfile, isSuccess: isSuccessUserProfile } = trpc.useQuery(
    ['users.byUsername', { username: username! }],
    {
      enabled: !!username,
    }
  );

  const { data: createMemberSignature } = trpc.useQuery(
    [
      'blockend.signCreateMember',
      {
        name: userProfile?.username || '',
        xp: userProfile?.xp || 0,
        courses: userProfile?.courses.map((c) => c.course.id) || [],
      },
    ],
    {
      enabled: !!userProfile,
    }
  );

  const { data: onChainProfile, refetch: refetchGetMember } = useContractRead({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'getMember',
    enabled: !!session?.user,
    args: [session?.user.address],
  });

  const { config: createMemberConfig } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'createMember',
    args: [
      ethers.utils.toUtf8CodePoints(userProfile?.username || ''), // _name
      userProfile?.xp, // _initialXP
      userProfile?.courses.map((c) => c.course.id), // -completedEvents
      [], // _badges
      createMemberSignature, // _sig
    ],
    enabled: !!userProfile && !!createMemberSignature,
  });

  const { data: createMemberRes, write: createMember } =
    useContractWrite(createMemberConfig);

  useWaitForTransaction({
    hash: createMemberRes?.hash,
    onSuccess: () => {
      refetchGetMember();
    },
  });

  const { config: mintTokenConfig } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'mintTokenForMember',
    args: [session?.user.address, SBT_CONTRACT_ADDRESS],
    overrides: {
      value: SBT_MINT_FEE,
    },
    enabled: onChainProfile?.pathChosen,
  });
  const { data: mintTokenRes, write: mintToken } =
    useContractWrite(mintTokenConfig);

  const { isLoading: isLoadingMintToken } = useWaitForTransaction({
    hash: mintTokenRes?.hash,
    onSuccess: () => {
      refetchGetMember();
    },
  });

  const { data: tokenUri } = useContractRead({
    addressOrName: SBT_CONTRACT_ADDRESS,
    contractInterface: SBT_CONTRACT_ABI,
    functionName: 'tokenURI',
    enabled: onChainProfile?.tokenId._hex !== '0x00',
    args: [onChainProfile?.tokenId._hex],
  });

  useQuery(
    ['tokenMetadata', tokenUri],
    () =>
      fetch(tokenUri?.toString() || '').then((res) => console.log(res.json())),
    {
      enabled: !!tokenUri,
    }
  );

  const enrolledCourses = userProfile?.courses.filter(
    (c) => c.completed === false && c.enrolled === true
  );

  const handleProfileCreation = () => {
    if (createMember) createMember({});
  };

  // const updateUsername = trpc.useMutation(['users.updateUsername'], {
  //   onError: (err) => {
  //     toast.error(err.message);
  //   },
  //   onSuccess: () => {
  //     utils.invalidateQueries(['users.byUsername', { username: newUsername }]);
  //     router.replace(`/profiles/${newUsername}`);
  //   },
  // });

  // TODO: redirect to home if profile doesn't exist
  if (isSuccessUserProfile && !userProfile) {
    return <div>Profile not found</div>;
  }

  console.log('userProfile');
  console.log(userProfile);

  return (
    <div>
      <nav className="flex items-center justify-center space-x-10 border border-main-gray-dark">
        <p className="p-2">Event</p>
        <p className="p-2">Projects</p>
        <p className="p-2">Learning Path</p>
        <p className="p-2">Personal Roadmap</p>
      </nav>
      {/* Hero section */}
      {userProfile && (
        <>
          <EditProfileModal open={true} userProfile={userProfile} />
          <div className="my-8 flex items-center justify-center px-[5.5rem]">
            <div className="min-h-[255px] w-[38%] rounded-md bg-main-gray-light p-8 pl-12">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold">
                  {userProfile.username === userProfile.address
                    ? formatAddress(userProfile.username)
                    : userProfile.username}
                </h1>
                {!onChainProfile ? <FaLock /> : <FaEdit />}
              </div>
              <p className="font-light">
                pus1 Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Expedita quis rem soluta maxime. Dolor qui inventore blanditiis
                nihil cum eum non ab dignissimos, incidunt aliquid ducimus
                iusto, quia possimus. Repudiandae, reprehenderit officiis!
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
        </>
      )}
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
