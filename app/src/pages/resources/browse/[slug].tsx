import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import ResourceCard from '~/components/ResourceCard';
// import { trpc } from '~/utils/trpc';
import resources from '../../../../prisma/seedData/resources.json';

const Resource: NextPage = () => {
  const router = useRouter();

  const { slug } = router.query;

  /* didn't work :( 
  const { data: resources } = trpc.useQuery([
    'resources.all',
    {
      technologies: slug,
    },
  ]); 
  */

  return (
    <div className="min-h-[25rem]">
      {/* Header */}
      <div className="flex flex-col py-8 px-[5.5rem]">
        <h1 className="mb-4 text-5xl font-bold">Resources for {slug}</h1>
        <p className="max-w-lg font-light">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat
          suscipit.
        </p>
      </div>
      {/* Course Grid */}
      <div className="px-[5.5rem]">
        {/* Grid */}
        <div className="grid grid-cols-3 gap-6">
          {resources?.map(
            (resource) =>
              resource.technologies[0] === slug && (
                <ResourceCard
                  key={`course-${resource.id}`}
                  resource={resource}
                />
              )
          )}
          {resources?.map(
            (resource) =>
              resource.technologies[0] === slug && (
                <ResourceCard
                  key={`course-${resource.id}`}
                  resource={resource}
                />
              )
          )}
          {resources?.map(
            (resource) =>
              resource.technologies[0] === slug && (
                <ResourceCard
                  key={`course-${resource.id}`}
                  resource={resource}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Resource;
