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
        if (!data) {
          disconnect();
        }
        if (onChainProfile) {
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

  useEffect(() => {
    if (onChainProfile?.tokenMetadata) {
      const sbtURL = onChainProfile.tokenMetadata.image
        .replace('ipfs:', 'https:')
        .concat('.ipfs.nftstorage.link/');
      if (sbtURL !== currSBT) {
        setPrevSBT(currSBT);
        setCurrSBT(sbtURL);
      }
    }
  }, [onChainProfile]);

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
