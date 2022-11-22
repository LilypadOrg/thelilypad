import { NextPage } from 'next';
import Link from 'next/link';
import LevelPill from '../../components/ui/LevelPill';
import { trpc } from '~/utils/trpc';
import { useRouter } from 'next/router';
import { UserCourseWithContent } from '~/types/types';
import CourseCard from '~/components/CourseCard';
import { LearningPathCards } from '~/components/ui/userProfile';
import UserProfile from '~/components/UserProfile';

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

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const username = router.query.username as string | undefined;

  const { data: userProfile, isSuccess: isSuccessUserProfile } = trpc.useQuery(
    ['users.byUsername', { username: username! }],
    {
      enabled: !!username,
    }
  );

  const { data: userCourses } = trpc.useQuery(
    ['usercourses.all', { userId: userProfile?.id || -1 }],
    {
      enabled: !!userProfile,
    }
  );

  type RoadmapCourses = {
    beginner: UserCourseWithContent[];
    intermediate: UserCourseWithContent[];
    advanced: UserCourseWithContent[];
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

  return (
    <div>
      <div className="gradient-bg-top pt-2">
        <nav className="flex flex-wrap items-center justify-center  space-x-4 lg:space-x-10">
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
        {userProfile && <UserProfile userProfile={userProfile} />}
      </div>
      {/* My Learning Path */}
      <div
        id="path"
        className="flex flex-col bg-main-gray-light px-[2.5rem]  py-16 lg:px-[5.5rem]"
      >
        <h1 className="mb-1 text-3xl font-bold">My Learning Path</h1>
        <p className="font-light lg:w-[40%]">
          These are the most recent Accolades you have earned (or will earn once
          holding a Pond Token). Great job! Click on each to learn more and
          share badges you have earned!
        </p>
        <div className="mt-6 flex flex-wrap gap-6">
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
        className="mt-4 flex flex-col space-y-4 px-[2.5rem]  py-16 lg:px-[5.5rem]"
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
        className="my-4 flex flex-col space-y-4 px-[2.5rem]  py-16 lg:my-10 lg:px-[5.5rem]"
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
      <div
        id="roadmap"
        className="flex flex-col px-[2.5rem]  py-16 lg:px-[5.5rem]"
      >
        <h1 className="mb-1 text-3xl font-bold">My Personal Roadmap</h1>
        <p className="font-light lg:w-[40%]">
          Populate this personal roadmap with courses of your choosing to set
          milestones for yourself and track your progress on a custom path!
        </p>
      </div>
      {/* Beginner */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[2.5rem]  py-12 lg:px-[5.5rem]">
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
          <button className=" rounded-md bg-gray-800 py-2 px-2 font-semibold text-white lg:px-10 lg:py-2">
            <Link href="/courses/browse/level/beginner">Take final test</Link>
          </button>

          <button className="rounded-md bg-gray-800  py-2 px-2 font-semibold text-white lg:px-10 lg:py-2">
            <Link href="/courses/browse/level/beginner">
              More Beginner Course
            </Link>
          </button>
        </div>
      </div>
      {/* Intermediate */}
      <div className="flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[2.5rem]  py-12 lg:px-[5.5rem]">
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
          <button className="rounded-md bg-gray-800 py-2 px-2  font-semibold text-white lg:px-10 lg:py-2">
            <Link href="/courses/browse/level/beginner">Take final test</Link>
          </button>

          <button className="rounded-md bg-gray-800 py-2 px-2 font-semibold text-white lg:px-10 lg:py-2 ">
            <Link href="/courses/browse/level/intermediate">
              More Intermediate Courses
            </Link>
          </button>
        </div>
      </div>
      {/* Advanced */}
      <div className="gradient-bg-bottom flex flex-col space-y-10 border-t-2 border-main-gray-dark px-[2.5rem]  py-12 lg:px-[5.5rem]">
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
          <button className=" rounded-md bg-gray-800 py-1 font-semibold text-white lg:px-10 lg:py-2">
            <Link href="/courses/browse/level/beginner">Take final test</Link>
          </button>

          <button className=" rounded-md bg-gray-800 py-1 font-semibold text-white lg:px-10 lg:py-2">
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

export default ProfilePage;
