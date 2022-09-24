import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useAccount, useContractRead, useDisconnect, useQuery } from 'wagmi';
import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import {
  MAIN_CONTRACT_ABI,
  MAIN_CONTRACT_ADDRESS,
  SBT_CONTRACT_ABI,
  SBT_CONTRACT_ADDRESS,
} from '~/utils/contracts';

const AccountWidget = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();
  const [prevSBT, setPrevSBT] = useState<string>();
  const [currentSBT, setCurrentSBT] = useState<string>();

  useEffect(() => {
    if (address && session && session.user.address !== address) {
      disconnect();
    }
  }, [address, session, disconnect]);

  const { data: user } = trpc.useQuery(
    ['users.byAddress', { address: session?.user.address || '' }],
    {
      enabled: !!session?.user,
      onSuccess: (data) => {
        console.log('user.byAddress successfull');
        if (!data) {
          disconnect();
        }
      },
    }
  );

  // TODO: move all code related to onChain profile to a custom hook to be used here and in profile page
  const { data: onChainProfile } = useContractRead({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'getMember',
    enabled: !!user,
    args: [user?.address],
  });

  const { data: tokenUri } = useContractRead({
    addressOrName: SBT_CONTRACT_ADDRESS,
    contractInterface: SBT_CONTRACT_ABI,
    functionName: 'tokenURI',
    enabled: onChainProfile?.tokenId._hex !== '0x00',
    args: [onChainProfile?.tokenId._hex],
  });

  const { data: tokenMetadata } = useQuery(
    ['tokenMetadata', tokenUri],
    async () => {
      const data = await (await fetch(tokenUri?.toString() || '')).json();
      return data;
    },
    {
      enabled: !!tokenUri,
      onSuccess: (data) => {
        console.log('updating SBT state');
        const sbtURL = data.image
          .replace('ipfs:', 'https:')
          .concat('.ipfs.nftstorage.link/');
        if (sbtURL !== currentSBT) {
          setPrevSBT(currentSBT);
          setCurrentSBT(sbtURL);
        }
      },
    }
  );

  console.log('prevSBT');
  console.log(prevSBT);
  console.log('currentSBT');
  console.log(currentSBT);

  return user ? (
    <div>
      <Link href={`/profiles/${user.username}`}>
        <button className="text-p rounded-lg  bg-secondary-400 p-2 font-bold text-white shadow-md shadow-gray-300">
          Lvl: {user?.level.number} / XP: {user?.xp}
        </button>
      </Link>
    </div>
  ) : null;
};

export default AccountWidget;
