import Link from 'next/link';
import { useDAOTreasure } from '~/hooks/useDAOTreasure';
import Web3 from 'web3';

const TreasureWidget = () => {
  const { treasureValue } = useDAOTreasure();
  const web3: Web3 = new Web3();

  return (
    <div>
      <Link href={`/dao`}>
        <button className="hidden rounded-lg border-primary-500 bg-primary-400 p-2 text-xs  font-bold  text-white shadow-md shadow-gray-300 lg:block lg:p-2 lg:text-lg">
          Froggy DAO Treasury:{' '}
          {web3.utils.fromWei((treasureValue ?? 0).toString(), 'ether')}
        </button>
      </Link>
    </div>
  );
};

export default TreasureWidget;
