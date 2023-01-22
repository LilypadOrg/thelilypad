import { NextPage } from 'next';
import Link from 'next/link';
import PageTitle from '~/components/ui/PageTitle';
import useAdmin from '~/hooks/useAdmin';

const AdminPage: NextPage = () => {
  useAdmin();

  return (
    <>
      <PageTitle title="Admin" />
      <ul>
        <li>
          <Link href="/admin/projects">
            <a>Projects</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default AdminPage;
