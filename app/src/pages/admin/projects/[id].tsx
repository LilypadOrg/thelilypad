import { NextPage } from 'next';
import { useRouter } from 'next/router';
import PageTitle from '~/components/ui/PageTitle';
import useAdmin from '~/hooks/useAdmin';
import { api } from '~/utils/api';

const AdminProjectPage: NextPage = () => {
  useAdmin();
  const router = useRouter();
  const id = Number(router.query.id);

  const {
    data: project,
    isLoading,
    // error,
  } = api.projects.byId.useQuery({ id });

  // error?.data?.code === 'NOT_FOUND' && router.push('/');

  return (
    <>
      <PageTitle title="Admin Projects" />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>{project?.content.title}</h1>
        </div>
      )}
    </>
  );
};

export default AdminProjectPage;
