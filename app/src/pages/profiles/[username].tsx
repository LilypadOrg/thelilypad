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
import { useState } from 'react';
import { useRouter } from 'next/router';
import { SBT_MINT_FEE } from '~/utils/constants';
import { formatAddress } from '~/utils/formatters';
import EditProfileModal from '~/components/EditProfileModal';
import { UserCourse } from '~/types/types';
import CourseCard from '~/components/CourseCard';

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
  const router = useRouter();
  const username = router.query.username as string | undefined;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('update');

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
    enabled: !!session?.user,
    args: [session?.user.address],
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

  const { data: tokenMetadata } = useQuery(
    ['tokenMetadata', tokenUri],
    async () => {
      const data = await (await fetch(tokenUri?.toString() || '')).json();
      return data;
    }
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
    return <div>Profile not found</div>;
  }

  const openModal = () => {
    setModalOpen(true);
    setModalMode(onChainProfile?.pathChosen ? 'update' : 'create');
  };

  const closeModal = () => {
    setModalOpen(false);
    refetchGetMember();
  };

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
          {session && modalOpen && (
            <EditProfileModal
              open={modalOpen}
              closeModal={closeModal}
              userProfile={userProfile}
              mode={modalMode}
            />
          )}
          <div className="my-8 flex items-center justify-center px-[5.5rem]">
            <div className="min-h-[255px] w-[38%] rounded-md bg-main-gray-light p-8 pl-12">
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-bold">
                  {userProfile.username === userProfile.address
                    ? formatAddress(userProfile.username)
                    : userProfile.username}
                </h1>
              </div>
              <p className="font-light">{userProfile.bio}</p>
            </div>
            <div className="space-y-3 bg-main-gray-light">
              <div>
                {!tokenMetadata && (
                  <Image
                    src="/images/profileSBT/frogSBT.png"
                    alt="sbt"
                    layout="intrinsic"
                    objectFit="contain"
                    width={500}
                    height={300}
                  />
                )}
                {tokenMetadata && (
                  // TODO: find a a better way to display and resize SVG
                  <div
                    className="w-10"
                    dangerouslySetInnerHTML={{
                      __html: tokenMetadata.image_data.replace(
                        "width='1024px' height='1024px'",
                        "width='170px' height='170px'"
                      ),
                    }}
                  />
                )}
              </div>
              {session && session.user.address === userProfile.address && (
                <>
                  <button
                    onClick={openModal}
                    className="w-full rounded-[6.5px] bg-primary-400 px-10 py-4 font-bold text-white"
                  >
                    {onChainProfile?.pathChosen ? 'Update' : 'Create'} Profile
                  </button>
                  {/* TODO: Show spinner in button when loading */}
                  {onChainProfile?.['tokenId']._hex === '0x00' && (
                    <button
                      disabled={
                        !onChainProfile?.pathChosen ||
                        !mintToken ||
                        isLoadingMintToken
                      }
                      className="w-full rounded-[6.5px] bg-primary-400 px-10 py-4 font-bold text-white disabled:bg-gray-500"
                      onClick={() => mintToken?.()}
                    >
                      Mint Your SBT
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="min-h-[255px] w-[38%] items-stretch rounded-md bg-main-gray-light p-8 pl-12">
              <h1 className="text-2xl font-bold">My Tech Stack</h1>
              <div className="grid grid-cols-3 gap-1">
                {userProfile.technologies.map((language) => (
                  <LevelPill
                    key={`skill-${language.id}`}
                    level={language.name}
                    classes="justify-self-start"
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {/* My Learning Path */}
      <div className="flex flex-col bg-main-gray-light px-[5.5rem] py-[2.2rem]">
        <h1 className="mb-1 text-3xl font-bold">My Learning Path</h1>
        <p className="w-[40%] font-light">
          These are the most recent Accolades you have earned (or will earn once
          holding a Pond Token). Great job! Click on each to learn more and
          share badges you have earned!
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

      {/* My personal roadmap */}
      <div className="flex flex-col px-[5.5rem] py-[2.2rem]">
        <h1 className="mb-1 text-3xl font-bold">My Personal Roadmap</h1>
        <p className="w-[40%] font-light">
          Populate this personal roadmap with courses of your choosing to set
          milestones for yourself and track your progress on a custom path!
        </p>
      </div>
      {/* Beginner */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex justify-between space-x-8">
          <div className="flex flex-col space-y-6">
            <p className="text-md font-semibold leading-5 underline">
              Beginner{' '}
              {roadmapCourses.beginner.filter((f) => f?.completed).length || 0}{' '}
              / {roadmapCourses.beginner.length || 0}
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
        <button className="ml-auto rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
          <Link href="/courses/browse/level/beginner">
            More Beginner Course
          </Link>
        </button>
      </div>
      {/* Intermediate */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex justify-between space-x-8">
          <div className="flex flex-col space-y-6">
            <p className="text-md font-semibold leading-5 underline">
              Intermediate{' '}
              {roadmapCourses.intermediate.filter((f) => f?.completed).length ||
                0}{' '}
              / {roadmapCourses.intermediate.length || 0}
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
        <button className="ml-auto rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
          <Link href="/courses/browse/level/intermediate">
            More Intermediate Courses
          </Link>
        </button>
      </div>
      {/* Advanced */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[5.5rem] py-12">
        <div className="flex justify-between space-x-8">
          <div className="flex flex-col space-y-6">
            <p className="text-md font-semibold leading-5 underline">
              Advanced{' '}
              {roadmapCourses.advanced.filter((f) => f?.completed).length || 0}{' '}
              / {roadmapCourses.advanced.length || 0}
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
        <button className="ml-auto rounded-md bg-gray-800 px-10 py-2 font-semibold text-white">
          <Link href="/courses/browse/level/advanced">
            More Intermediate Courses
          </Link>
        </button>
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
