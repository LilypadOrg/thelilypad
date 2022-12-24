import { NextPage } from 'next';
// import React, { useState } from 'react';
import { trpc } from '~/utils/trpc';
import 'swiper/css';
import 'swiper/css/pagination';
import { SpotLightCards } from '~/components/ui/Home';
import { SpotLightCardsLoading } from '~/components/ui/Loaders';
// import EditProjectModal from '~/components/EditProjectModal';
import Link from 'next/link';

const Projects: NextPage = () => {
  const { data: projects, isLoading } = trpc.useQuery(['projects.all']);
  // const [showProjectModal, setShowProjectModal] = useState<boolean>(false);

  // const openModal = () => {
  //   setShowProjectModal(true);
  // };

  // const closeModal = () => {
  //   setShowProjectModal(false);
  // };

  return (
    <>
      {/* {showProjectModal && (
        <EditProjectModal open={showProjectModal} closeModal={closeModal} />
      )} */}
      <div className="gradient-bg-top-courses px-[2.5rem] pt-2 lg:px-[5.5rem]">
        <h3 className="mb-8 mt-4">Community Projects</h3>
        {false && (
          <button className="mb-4 rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500">
            <Link href="/projects/create">Add a project</Link>
          </button>
        )}
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
    </>
  );
};

export default Projects;
