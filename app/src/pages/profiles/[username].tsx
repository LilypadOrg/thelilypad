import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import LevelPill from '../../components/ui/LevelPill';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { SBT_MINT_FEE } from '~/utils/constants';
import { formatAddress } from '~/utils/formatters';
import EditProfileModal from '~/components/EditProfileModal';
import { UserCourse } from '~/types/types';
import CourseCard from '~/components/CourseCard';
import MintSBTModal from '~/components/MintSBTModal';
import { LearningPathCards } from '~/components/ui/userProfile';
import Tilt from 'react-parallax-tilt';
import TagsPill from '~/components/TagsPill';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { CreateTypes } from 'canvas-confetti';
import CourseCarousel from '~/components/CourseCarousel';

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

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

const UserProfile: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const username = router.query.username as string | undefined;
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editModalMode, setEditModalMode] = useState<'create' | 'update'>(
    'update'
  );

  const [mintModalOpen, setMintModalOpen] = useState<boolean>(false);

  /* Animation stuff */
  // const [fire, setFire] = useState<boolean>(false);
  const refAnimationInstance = useRef<CreateTypes | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const getInstance = useCallback((confetti: CreateTypes) => {
    refAnimationInstance.current = confetti;
  }, []);

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
      refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
    }
  }, []);

  const stopAnimation = useCallback(() => {
    clearInterval(intervalId?.toString());
    setIntervalId(null);
    refAnimationInstance.current && refAnimationInstance.current.reset();
  }, [intervalId]);

  const startAnimation = useCallback(() => {
    if (!intervalId) {
      setIntervalId(window.setInterval(nextTickAnimation, 400));
      setTimeout(stopAnimation, 4000);
    }
  }, [intervalId, nextTickAnimation, stopAnimation]);

  useEffect(() => {
    return () => {
      clearInterval(intervalId?.toString());
    };
  }, [intervalId]);

  /* Animation stuff */

  const { data: userProfile, isSuccess: isSuccessUserProfile } = trpc.useQuery(
    ['users.byUsername', { username: username! }],
    {
      enabled: !!username,
    }
  );

  // console.log('userProfile');
  // console.log(userProfile);

  const { data: userCourses } = trpc.useQuery(
    ['usercourses.all', { userId: userProfile?.id || -1 }],
    {
      enabled: !!userProfile,
    }
  );

  const { data: onChainProfile, refetch: refetchGetMember } = useContractRead({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'getMember',
    enabled: !!userProfile,
    args: [userProfile?.address],
  });

  const { config: mintTokenConfig } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'mintTokenForMember',
    args: [session?.user.address, SBT_CONTRACT_ADDRESS],
    overrides: {
      value: SBT_MINT_FEE,
    },
    enabled:
      !!onChainProfile &&
      onChainProfile.pathChosen &&
      onChainProfile.tokenId._hex === '0x00',
  });

  const { data: mintTokenRes, write: mintToken } =
    useContractWrite(mintTokenConfig);

  const { isLoading: isLoadingMintToken } = useWaitForTransaction({
    hash: mintTokenRes?.hash,
    onSuccess: () => {
      refetchGetMember();
      closeMintModal();
      fireCelebration();
    },
  });

  const { data: tokenUri } = useContractRead({
    addressOrName: SBT_CONTRACT_ADDRESS,
    contractInterface: SBT_CONTRACT_ABI,
    functionName: 'tokenURI',
    enabled: onChainProfile?.tokenId._hex !== '0x00',
    args: [onChainProfile?.tokenId._hex],
  });

  const { data: tokenMetadata } = useQuery(
    ['tokenMetadata', tokenUri],
    async () => {
      const data = await (await fetch(tokenUri?.toString() || '')).json();
      return data;
    },
    { enabled: !!tokenUri }
  );

  type RoadmapCourses = {
    beginner: UserCourse[];
    intermediate: UserCourse[];
    advanced: UserCourse[];
  };

  const initRoadmap: RoadmapCourses = {
    beginner: [],
    intermediate: [],
    advanced: [],
  };

  const roadmapCourses: RoadmapCourses =
    userCourses
      ?.filter((c) => c.roadmap)
      .reduce((prev, curr) => {
        const courseLevels = curr.course.levels.map((l) => l.name);
        if (!courseLevels) return prev;
        if (courseLevels.includes('Beginner')) {
          prev = { ...prev, beginner: [...prev.beginner, curr] };
        }
        if (courseLevels.includes('Intermediate')) {
          prev = { ...prev, intermediate: [...prev.intermediate, curr] };
        }
        if (courseLevels.includes('Advanced')) {
          prev = { ...prev, advanced: [...prev.advanced, curr] };
        }
        return prev;
      }, initRoadmap) || initRoadmap;

  // TODO: redirect to home if profile doesn't exist
  if (isSuccessUserProfile && !userProfile) {
    router.replace({ pathname: '/' });
  }

  const openModal = () => {
    setEditModalOpen(true);
    setEditModalMode(onChainProfile?.pathChosen ? 'update' : 'create');
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    refetchGetMember();
  };

  const closeMintModal = () => {
    setMintModalOpen(false);
  };

  /* Animation Stuff */

  function getAnimationSettings(originXA: number, originXB: number) {
    return {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount: 150,
      colors: [
        '#0fc6fd',
        '#9844fd',
        '#fe4e71',
        '#70ff37',
        '#f8fb2b',
        '#f79916',
        '#fc1dfc',
      ],
      origin: {
        x: randomInRange(originXA, originXB),
        y: Math.random() - 0.2,
      },
    };
  }

  const fireCelebration = () => {
    startAnimation();
  };

  const sbtImageUri = tokenMetadata?.image
    .replace('ipfs:', 'https:')
    .concat('.ipfs.nftstorage.link/');

  // console.log('onChainProfile');
  // console.log(onChainProfile);

  // console.log('tokenMetadata');
  // console.log(tokenMetadata);

  return (
    <div>
      <ReactCanvasConfetti
        className="pointer-events-none fixed top-0 left-0 z-[1000] h-full w-full"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next-line
        refConfetti={getInstance}
      />
      <nav className="flex items-center justify-center space-x-10 border border-main-gray-light">
        <Link href="#events">
          <p className="p-2 font-semibold hover:cursor-pointer">Events</p>
        </Link>
        <Link href="#projects">
          <p className="p-2 font-semibold hover:cursor-pointer">Projects</p>
        </Link>
        <Link href="#path">
          <p className="p-2 font-semibold hover:cursor-pointer">
            Learning Path
          </p>
        </Link>
        <Link href="#roadmap">
          <p className="p-2 font-semibold hover:cursor-pointer">
            Personal Roadmap
          </p>
        </Link>
      </nav>
      {/* Hero section */}
      {userProfile && (
        <>
          {session && editModalOpen && (
            <EditProfileModal
              open={editModalOpen}
              closeModal={closeEditModal}
              userProfile={userProfile}
              mode={editModalMode}
            />
          )}
          {session && mintModalOpen && (
            <MintSBTModal
              open={mintModalOpen}
              closeModal={closeMintModal}
              mintFunction={mintToken}
              mintIsLoading={isLoadingMintToken}
              fireCelebration={fireCelebration}
            />
          )}
          <div className="my-8 flex items-center justify-center px-[5.5rem]">
            <div className="-mr-3 min-h-[255px] w-[38%] rounded-lg bg-primary-500 p-8 pl-12 text-white shadow-sm">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold">
                  {userProfile.username === userProfile.address
                    ? formatAddress(userProfile.username)
                    : userProfile.username}
                </h1>
              </div>
              <p className="font-light">{userProfile.bio}</p>
            </div>
            <Tilt
              className="parallax-effect-glare-scale"
              glareEnable={true}
              glareMaxOpacity={1}
              scale={1.02}
            >
              <>
                {!tokenMetadata && (
                  <div className="relative flex h-[425px] w-[380px] cursor-pointer items-center justify-center rounded-lg bg-gray-400 p-4 shadow-xl">
                    <Image
                      src="/images/profileSBT/level1-gray.jpg"
                      alt="sbt"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg opacity-25"
                    />
                  </div>
                )}
                {tokenMetadata && (
                  <div className="relative flex h-[380px] w-[380px] cursor-pointer items-center justify-center rounded-lg border-4 border-black p-4 shadow-xl">
                    <Image
                      loader={() => sbtImageUri}
                      src={sbtImageUri}
                      alt="sbt"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                )}
                {/* {tokenMetadata && userProfile.level.number === 1 && (
                  // TODO: find a a better way to display and resize SVG
                  <Image
                    src="/images/profileSBT/level1-gray.svg"
                    alt="sbt"
                    layout="fill"
                    objectFit="contain"
                  />
                )}
                {tokenMetadata && userProfile.level.number === 2 && (
                  // TODO: find a a better way to display and resize SVG
                  <Image
                    src="/images/profileSBT/level2-gray.svg"
                    alt="sbt"
                    layout="fill"
                    objectFit="contain"
                  />
                )} */}
              </>
            </Tilt>
            <div className="-ml-3 min-h-[255px] w-[38%] items-stretch rounded-lg bg-primary-500 p-8 pl-12 text-white shadow-sm">
              <h1 className="text-2xl font-bold">My Tech Stack</h1>
              <div className="grid grid-cols-3 gap-2">
                {userProfile.technologies.map((language) => (
                  <TagsPill
                    key={`skill-${language.id}`}
                    name={language.name}
                    classes="justify-self-start"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mb-6 -mt-1 flex items-center justify-center">
            {session && session.user.address === userProfile.address && (
              <div className="space-y-4">
                <button
                  onClick={openModal}
                  className="w-full rounded-[6.5px] bg-primary-400 px-10 py-4 font-bold text-white"
                >
                  {onChainProfile?.pathChosen ? 'Update' : 'Create'} Profile
                </button>

                {onChainProfile?.['tokenId']._hex === '0x00' && (
                  <button
                    disabled={
                      !onChainProfile?.pathChosen ||
                      !mintToken ||
                      isLoadingMintToken
                    }
                    className="w-full rounded-[6.5px] bg-primary-400 px-10 py-4 font-bold text-white hover:bg-primary-400 disabled:bg-gray-500"
                    onClick={() => setMintModalOpen(true)}
                  >
                    Mint Your SBT
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {/* My Learning Path */}
      <div
        id="path"
        className="flex flex-col bg-main-gray-light px-[5.5rem] py-16"
      >
        <h1 className="mb-1 text-3xl font-bold">My Learning Path</h1>
        <p className="w-[40%] font-light">
          These are the most recent Accolades you have earned (or will earn once
          holding a Pond Token). Great job! Click on each to learn more and
          share badges you have earned!
        </p>
        <div className="mt-6 flex space-x-8">
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
      {/* My Events */}
      <div
        id="events"
        className="mt-4 flex flex-col space-y-4 px-[5.5rem] py-16"
      >
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
      <div
        id="projects"
        className="my-10 flex flex-col space-y-4 px-[5.5rem] py-16"
      >
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

      {/* My personal roadmap */}
      <div id="roadmap" className="flex flex-col px-[5.5rem] py-16">
        <h1 className="mb-1 text-3xl font-bold">My Personal Roadmap</h1>
        <p className="w-[40%] font-light">
          Populate this personal roadmap with courses of your choosing to set
          milestones for yourself and track your progress on a custom path!
        </p>
      </div>
      {/* Beginner */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex space-x-8">
          <div className="flex flex-col space-y-6">
            <p className="text-md font-semibold leading-5 underline">
              Beginner{' '}
              {roadmapCourses.beginner.filter((f) => f?.completed).length || 0}{' '}
              / {roadmapCourses.beginner.length || 0}
            </p>
          </div>

          {/* TODO: replace with carousel component for all courses level */}
          <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
            {roadmapCourses.beginner.map((course) => (
              /* Its same as CourseCard component */
              <CourseCard
                key={`roadmap-course-${course!.courseId}`}
                course={course!.course}
                type="simple"
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-x-4">
          <button className=" rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
            <Link href="/courses/browse/level/beginner">Take final test</Link>
          </button>

          <button className="rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
            <Link href="/courses/browse/level/beginner">
              More Beginner Course
            </Link>
          </button>
        </div>
      </div>
      {/* Intermediate */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex space-x-8">
          <div className="flex flex-col space-y-6">
            <p className="text-md font-semibold leading-5 underline">
              Intermediate{' '}
              {roadmapCourses.intermediate.filter((f) => f?.completed).length ||
                0}{' '}
              / {roadmapCourses.intermediate.length || 0}
            </p>
          </div>
          <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
            {roadmapCourses.intermediate.map((course) => (
              /* Its same as CourseCard component */
              <CourseCard
                key={`roadmap-course-${course!.courseId}`}
                course={course!.course}
                type="simple"
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-x-4">
          <button className=" rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
            <Link href="/courses/browse/level/beginner">Take final test</Link>
          </button>

          <button className="rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
            <Link href="/courses/browse/level/intermediate">
              More Intermediate Courses
            </Link>
          </button>
        </div>
      </div>
      {/* Advanced */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex space-x-8">
          <div className="flex flex-col space-y-6">
            <p className="text-md font-semibold leading-5 underline">
              Advanced{' '}
              {roadmapCourses.advanced.filter((f) => f?.completed).length || 0}{' '}
              / {roadmapCourses.advanced.length || 0}
            </p>
            <button className="self-start rounded-md bg-main-gray-light px-12 py-2 font-semibold">
              Take final test
            </button>
          </div>
          <div className="mt-8 flex space-x-8 overflow-x-auto px-2 py-2">
            {roadmapCourses.advanced.map((course) => (
              /* Its same as CourseCard component */
              <CourseCard
                key={`roadmap-course-${course!.courseId}`}
                course={course!.course}
                type="simple"
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-x-4">
          <button className=" rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
            <Link href="/courses/browse/level/beginner">Take final test</Link>
          </button>

          <button className=" rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
            <Link href="/courses/browse/level/advanced">
              More Advance Courses
            </Link>
          </button>
        </div>
      </div>
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
    title: 'Perfi',
    id: 'a',
    time: 'Sun 11 September 2022',
  },
  {
    title: 'QueenE DAO',
    id: 'b',
    time: 'Sat 06 August 2022',
  },
];

export default UserProfile;
