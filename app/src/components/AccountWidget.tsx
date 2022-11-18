import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import LevelUpModal from './LevelUpModal';
import { useOnChainProfile } from '~/hooks/useOnChainProfile';

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
        console.log('fetch user');
        if (!data) {
          disconnect();
        }
        if (onChainProfile) {
          console.log('refetchOnchain');
          refetchOnchain();
        }
      },
      context: {
        skipBatch: true,
      },
    }
  );

  const { data: onChainProfile, refetch: refetchOnchain } = useOnChainProfile(
    user?.address
  );

  const tokenMetadata = onChainProfile?.tokenMetadata;
  console.log('tokenMedata');
  console.log(tokenMetadata);

  useEffect(() => {
    if (tokenMetadata) {
      const sbtURL = tokenMetadata.image
        .replace('ipfs:', 'https:')
        .concat('.ipfs.nftstorage.link/');
      console.log('sbtURL');
      console.log(sbtURL);
      console.log('prevSBT');
      console.log(prevSBT);
      console.log('currSBT');
      console.log(currSBT);
      if (sbtURL !== currSBT) {
        setPrevSBT(currSBT);
        setCurrSBT(sbtURL);
      }
    }
  }, [tokenMetadata]);

  useEffect(() => {
    if (prevSBT && currSBT) {
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
