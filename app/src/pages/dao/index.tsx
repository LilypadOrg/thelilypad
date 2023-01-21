import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import GovernanceToolBar from '~/components/GovernanceToolBar';
// Import Swiper styles
import GovernanceTreasury from '~/components/GovernanceTreasury';
import GovernanceList from '~/components/GovernanceList';

const Dao: NextPage = () => {
  const { data: session } = useSession();
  //const { data: courses, isLoading: coursesLoading } = trpc.useQuery([
  //  'courses.all',
  //]);

  return (
    <div className="gradient-bg-top-courses px-[2.5rem] pt-2 lg:px-[5.5rem]">
      <h3 className="mb-2 mt-2">Froggy DAO</h3>
      <br />
      <GovernanceTreasury />
      <GovernanceToolBar user={session?.user} />
      <GovernanceList />
    </div>
  );
};

export default Dao;
