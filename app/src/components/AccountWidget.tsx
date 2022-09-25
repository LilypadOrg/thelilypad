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
import LevelUpModal from './LevelUpModal';

const AccountWidget = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: session } = useSession();
  const [prevSBT, setPrevSBT] = useState<string>();
  const [currSBT, setCurrSBT] = useState<string>();
  const [levelUpModalOpen, setLevelUpModalOpen] = useState<boolean>(false);

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
        console.log('User data');
        console.log(data);
        if (!data) {
          disconnect();
        }
        if (onChainProfile) {
          console.log('refetching onChain data');
          refetchOnchain();
          refetchTokenUri();
        }
      },
      context: {
        skipBatch: true,
      },
    }
  );

  // TODO: move all code related to onChain profile to a custom hook to be used here and in profile page
  const { data: onChainProfile, refetch: refetchOnchain } = useContractRead({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'getMember',
    enabled: !!user,
    args: [user?.address],
    onSuccess: () => {
      console.log('fetchin onchain profile');
    },
  });

  const { data: tokenUri, refetch: refetchTokenUri } = useContractRead({
    addressOrName: SBT_CONTRACT_ADDRESS,
    contractInterface: SBT_CONTRACT_ABI,
    functionName: 'tokenURI',
    enabled: onChainProfile?.tokenId._hex !== '0x00',
    args: [onChainProfile?.tokenId._hex],
    onSuccess: () => {
      console.log('fetching tokenUri');
    },
  });

  const { data: tokenMedata } = useQuery(
    ['tokenMetadata', tokenUri],
    async () => {
      const data = await (await fetch(tokenUri?.toString() || '')).json();
      return data;
    },
    {
      enabled: !!tokenUri,
    }
  );

  useEffect(() => {
    if (tokenMedata) {
      console.log(tokenMedata);
      console.log('updating SBT state');
      const sbtURL = tokenMedata.image
        .replace('ipfs:', 'https:')
        .concat('.ipfs.nftstorage.link/');
      if (sbtURL !== currSBT) {
        setPrevSBT(currSBT);
        setCurrSBT(sbtURL);
      }
    }
  }, [tokenMedata]);

  useEffect(() => {
    if (prevSBT && currSBT) {
      console.log('Leveling up!!!!!!!!!!!!!!!');
      setLevelUpModalOpen(true);
    }
  }, [prevSBT, currSBT]);

  const closeLevelUpModal = () => {
    setLevelUpModalOpen(false);
    setPrevSBT(undefined);
  };

  return user ? (
    <div>
      {levelUpModalOpen && prevSBT && currSBT && (
        <LevelUpModal
          open={levelUpModalOpen}
          closeModal={closeLevelUpModal}
          prevSBT={prevSBT}
          currSBT={currSBT}
          reachedLevel={user.level.number}
        />
      )}
      <Link href={`/profiles/${user.username}`}>
        <button className="text-p rounded-lg  bg-secondary-400 p-2 font-bold text-white shadow-md shadow-gray-300">
          Lvl: {user.level.number} / XP: {user.xp}
        </button>
      </Link>
    </div>
  ) : null;
};

export default AccountWidget;
