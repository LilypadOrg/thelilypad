import { NextPage } from 'next';
import { trpc } from '~/utils/trpc';
import SpinningCircle from '~/components/ui/Loaders/SpinningCircle';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import EditProjectForm from '~/components/EditProjectForm';
import { useSession } from 'next-auth/react';

const EditProjectPage: NextPage = () => {
  const router = useRouter();
  const id = Number(router.query.id);
  const { status: sessionStatus } = useSession();

  const {
    data: project,
    isLoading,
    error,
  } = trpc.useQuery(['projects.byId', { id }], {
    enabled: sessionStatus !== 'loading',
  });

  useEffect(() => {
    if (error?.data?.code === 'NOT_FOUND') {
      router.replace('/');
    }
  }, [error?.data?.code, router]);

  return (
    <>
      {isLoading && (
        <div>
          <SpinningCircle /> Loading Project...
        </div>
      )}
      {project && <EditProjectForm project={project} />}
    </>
  );
};

export default EditProjectPage;
