import { NextPage } from 'next';
import React from 'react';
import { trpc } from '~/utils/trpc';
import 'swiper/css';
import 'swiper/css/pagination';
import { SpotLightCards } from '~/components/ui/Home';
import { SpotLightCardsLoading } from '~/components/ui/Loaders';

const Projects: NextPage = () => {
  const { data: projects, isLoading } = trpc.useQuery(['projects.all']);

  return (
    <div className="gradient-bg-top-courses px-[2.5rem] pt-2 lg:px-[5.5rem]">
      <h3 className="mb-8 mt-4">Community Projects</h3>

      <div className="md: grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          [1, 2, 3, 4, 5, 6].map((i) => (
            <SpotLightCardsLoading key={`LoadingCard-${i}`} />
          ))}
        {projects?.map((p, i) => (
          <SpotLightCards key={p.id} project={p} teal={Boolean(i % 2)} />
        ))}
      </div>
    </div>
  );
};

export default Projects;