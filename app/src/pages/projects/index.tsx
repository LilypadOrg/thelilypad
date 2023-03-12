import { NextPage } from 'next';
// import React, { useState } from 'react';
import { trpc } from '~/utils/trpc';
import 'swiper/css';
import 'swiper/css/pagination';
import { SpotLightCards } from '~/components/ui/Home';
import { SpotLightCardsLoading } from '~/components/ui/Loaders';
// import EditProjectModal from '~/components/EditProjectModal';
import { useSession } from 'next-auth/react';
import Button from '~/components/ui/Button';
import Link from 'next/link';
// import useAdmin from '~/hooks/useAdmin';

const Projects: NextPage = () => {
  // TODO: fix use of admin to allow project creation
  // useAdmin();
  const { data: projects, isLoading } = trpc.useQuery(['projects.all']);
  const { data: session } = useSession();
  const { data: user } = trpc.useQuery(
    ['users.byAddress', { address: session?.user?.address || '' }],
    {
      enabled: Boolean(session?.user?.address),
    }
  );

  return (
    <>
      <div className="gradient-bg-top-courses px-[2.5rem] pt-2 lg:px-[5.5rem]">
        <div className="flex items-center gap-x-4">
          <h3 className="mb-8 mt-4">Community Projects</h3>
          {user && user.hasPondSBT && (
            <Button>
              <Link href="/projects/create">Add a project</Link>
            </Button>
          )}
        </div>
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
