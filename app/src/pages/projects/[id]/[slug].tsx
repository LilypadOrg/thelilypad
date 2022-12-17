import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiFillTags } from 'react-icons/ai';
import { FaCogs } from 'react-icons/fa';
import { BsGithub } from 'react-icons/bs';
import LevelPill from '~/components/ui/LevelPill';
import { trpc } from '~/utils/trpc';
import { TbWorld } from 'react-icons/tb';

const ProjectPage: NextPage = () => {
  const id = Number(useRouter().query.id);
  const { data: project, isLoading } = trpc.useQuery(['projects.byId', { id }]);

  return (
    <div>
      <div className="gradient-bg-top-course px-[5.5rem]">
        {isLoading && (
          <div>
            <div className="flex animate-pulse flex-col py-8">
              <h1 className="mb-2 w-[30%] rounded-md bg-gray-400 text-4xl font-bold text-transparent">
                Loading Project...
              </h1>
            </div>
            {/* hero image */}
            <div className="relative flex h-[200px] w-full animate-pulse items-center justify-center rounded-md bg-main-gray-dark sm:h-[300px] md:h-[400px] lg:h-[600px]"></div>
          </div>
        )}
        {project && (
          <div>
            <div className="flex flex-col py-8 ">
              <h1 className="mb-4 text-4xl font-bold">
                {project.content.title}
              </h1>
            </div>
            {/* hero image */}
            <div className="relative flex h-[200px] w-full items-center justify-center rounded-md bg-main-gray-light sm:h-[300px] md:h-[400px] lg:h-[600px]">
              {project.content.coverImageUrl && (
                <Image
                  alt="thumbnail"
                  src={project.content.coverImageUrl}
                  layout="fill"
                  objectFit="contain"
                />
              )}
            </div>
            <div className="mt-4 flex gap-x-4">
              <div className="flex gap-x-2">
                <FaCogs className="text-2xl text-secondary-500" />
                {project.content.technologies.map((t) => (
                  <LevelPill
                    key={`course-tech-${t.id}`}
                    level={t.name}
                    url={`/courses/browse/tech/${t.slug}`}
                  />
                ))}
              </div>
              <div className="flex gap-x-2">
                <AiFillTags className="text-2xl text-secondary-500" />
                {project.content.tags.map((t) => (
                  <LevelPill
                    key={`course-tech-${t.id}`}
                    level={t.name}
                    url={`/courses/browse/tag/${t.slug}`}
                  />
                ))}
              </div>
            </div>
            {/* Intro and desc */}
            <h1 className="mb-0 text-3xl font-semibold">Description</h1>
            <p className="font-light">{project.content.description}</p>
            <div className="my-4" />
            <div className="flex flex-row gap-x-4">
              {project.content.url && (
                <Link href={project.content.url}>
                  <button className="inline-flex items-center rounded-xl bg-secondary-400 py-2 px-4 text-xl font-bold hover:bg-secondary-300">
                    <TbWorld className="mr-2" />
                    <span>Website</span>
                  </button>
                </Link>
              )}
              {project.codeUrl && (
                <Link href={project.codeUrl}>
                  <button className="inline-flex items-center rounded-xl bg-secondary-400 py-2 px-4 text-xl font-bold hover:bg-secondary-300">
                    <BsGithub className="mr-2" />
                    <span>Code</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
