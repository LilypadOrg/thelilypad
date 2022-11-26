import { NextPage } from 'next';
// Import Swiper styles
import GovernanceTreasury from '~/components/GovernanceTreasury';

const Dao: NextPage = () => {
  //const { data: courses, isLoading: coursesLoading } = trpc.useQuery([
  //  'courses.all',
  //]);

  return (
    <div className="gradient-bg-top-courses px-[2.5rem] pt-2 lg:px-[5.5rem]">
      <h3 className="mb-2 mt-2">Froggy DAO</h3>
      <GovernanceTreasury />
    </div>
  );
};

export default Dao;
