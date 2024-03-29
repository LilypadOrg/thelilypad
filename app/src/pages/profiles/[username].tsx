import { NextPage } from 'next';
import Link from 'next/link';
import LevelPill from '../../components/ui/LevelPill';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { Accolade, RoadmapCourses } from '~/types/types';
import { LearningPathCards } from '~/components/ui/userProfile';
import UserProfile from '~/components/UserProfile';
import PersonalRoadmap from '~/components/PersonalRoadmap';
import AccoladeCard from '~/components/AccoladeCard';

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
    <div className="flex items-center justify-between  rounded-md border-2 bg-primary-200 py-3 px-4">
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
  const username = router.query.username as string;

  // const { data: userCourses } = trpc.useQuery([
  //   'courses.byUsername',
  //   { username },
  // ]);

  const { data: userCourses } = api.usercourses.all.useQuery({ username });

  const { data: userProfile, isSuccess: isSuccessUserProfile } =
    api.users.byUsername.useQuery(
      { username: username! },
      {
        enabled: !!username,
      }
    );

  const initRoadmap: RoadmapCourses = {
    beginner: [],
    intermediate: [],
    advanced: [],
  };

  // const roadmapCourses: RoadmapCourses =
  //   userCourses
  //     ?.filter((c) => c.userCourses[0]?.roadmap)
  //     .reduce((prev, curr) => {
  //       const courseLevels = curr.levels.map((l) => l.name);
  //       if (!courseLevels) return prev;
  //       if (courseLevels.includes('Beginner')) {
  //         prev = { ...prev, beginner: [...prev.beginner, curr] };
  //       }
  //       if (courseLevels.includes('Intermediate')) {
  //         prev = { ...prev, intermediate: [...prev.intermediate, curr] };
  //       }
  //       if (courseLevels.includes('Advanced')) {
  //         prev = { ...prev, advanced: [...prev.advanced, curr] };
  //       }
  //       return prev;
  //     }, initRoadmap) || initRoadmap;

  const roadmapCourses: RoadmapCourses =
    userCourses
      ?.filter((c) => c.roadmap)
      .reduce((prev, curr) => {
        const courseLevels = curr.course.levels.map((l) => l.name);
        if (!courseLevels) return prev;
        if (courseLevels.includes('Beginner')) {
          prev = { ...prev, beginner: [...prev.beginner] };
        }
        if (courseLevels.includes('Intermediate')) {
          prev = { ...prev, intermediate: [...prev.intermediate, curr] };
        }
        if (courseLevels.includes('Advanced')) {
          prev = { ...prev, advanced: [...prev.advanced, curr] };
        }
        return prev;
      }, initRoadmap) || initRoadmap;

  const initAccolade: Accolade[] = [];

  const accolades: Accolade[] =
    userCourses
      ?.filter((c) => c.completed && !!c.completedOn)
      .sort((a, b) => {
        if (a.completedOn && b.completedOn) {
          return b.completedOn.getTime() - a.completedOn.getTime();
        }
        return 0;
      })
      .reduce((prev, curr) => {
        return [...prev, ...curr.course.accolades];
      }, initAccolade) || initAccolade;

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
      {/* My Accolades */}
      <div
        id="path"
        className="flex flex-col bg-primary-100/80 px-[2.5rem]  py-16 lg:px-[5.5rem]"
      >
        <h1 className="mb-1 text-3xl font-bold">My Accolades</h1>
        <p className="font-light lg:w-[40%]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio eum
          tempore porro aperiam ipsum. Delectus, suscipit! Magni eveniet,
          commodi, aliquid reiciendis nemo pariatur a dolores error at quo
          aspernatur atque.
        </p>
        <div className="mt-6 flex flex-wrap gap-6">
          {accolades.slice(0, 3).map((a) => (
            <AccoladeCard key={`accolade-${a.id}`} accolade={a} />
          ))}
        </div>
        <div>
          <Link href={`/profiles/${username}/accolades`}>
            See all accolades
          </Link>
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
      {/* My Learning Path */}
      <div
        id="path"
        className="flex flex-col bg-primary-100/80 px-[2.5rem]  py-16 lg:px-[5.5rem]"
      >
        <h1 className="mb-1 text-3xl font-bold">My Learning Path</h1>
        <p className="font-light lg:w-[40%]">
          These are the most recent Accolades you have earned (or will earn once
          holding a Pond Token). Great job! Click on each to learn more and
          share badges you have earned!
        </p>
        <div className="gird-cols-1 mt-6 grid gap-6 md:grid-cols-3  lg:grid-cols-4">
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
      <PersonalRoadmap roadmapCourses={roadmapCourses} />
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
