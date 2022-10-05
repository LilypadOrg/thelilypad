import { useEffect, useState } from 'react';
import { useMintSBT } from '~/hooks/useMintSBT';
import { UserProfile as UserProfileType } from '~/types/types';
import { formatAddress } from '~/utils/formatters';
import EditProfileModal from './EditProfileModal';
import MintSBTModal from './MintSBTModal';
import Tilt from 'react-parallax-tilt';
import Image from 'next/image';
import TagsPill from './TagsPill';
import { useSession } from 'next-auth/react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { useConfetti } from '~/hooks/useConfetti';
import { useOnChainProfile } from '~/hooks/useOnChainProfile';

const UserProfile = ({
  userProfile,
}: {
  userProfile: NonNullable<UserProfileType>;
}) => {
  const { data: session } = useSession();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editModalMode, setEditModalMode] = useState<'create' | 'update'>(
    'update'
  );

  const [mintModalOpen, setMintModalOpen] = useState<boolean>(false);
  const { fireCelebration, getConfettiInstance } = useConfetti();

  const {
    data: onChainProfile,
    isLoading: isLoadingOnChainProfile,
    refetch: refetchOnChainProfile,
  } = useOnChainProfile(userProfile?.address);

  const {
    mintToken,
    isLoading: isLoadingMintToken,
    isSuccess: isSuccessMintToken,
  } = useMintSBT(
    userProfile.address || '',
    !!onChainProfile &&
      onChainProfile.pathChosen &&
      onChainProfile.tokenId._hex === '0x00'
  );

  useEffect(() => {
    if (isSuccessMintToken) {
      refetchOnChainProfile();
      closeMintModal();
      fireCelebration();
    }
  }, [isSuccessMintToken, refetchOnChainProfile, fireCelebration]);

  const openModal = () => {
    setEditModalOpen(true);
    setEditModalMode(onChainProfile?.pathChosen ? 'update' : 'create');
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    refetchOnChainProfile();
  };

  const closeMintModal = () => {
    setMintModalOpen(false);
  };

  const sbtImageUrl = onChainProfile?.sbtImageUrl;

  return (
    <>
      <ReactCanvasConfetti
        className="pointer-events-none fixed top-0 left-0 z-[1000] h-full w-full"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next-line
        refConfetti={getConfettiInstance}
      />
      {session && editModalOpen && (
        <EditProfileModal
          open={editModalOpen}
          closeModal={closeEditModal}
          userProfile={userProfile}
          mode={editModalMode}
        />
      )}
      {session && mintModalOpen && (
        <MintSBTModal
          open={mintModalOpen}
          closeModal={closeMintModal}
          mintFunction={mintToken}
          mintIsLoading={isLoadingMintToken}
          fireCelebration={fireCelebration}
        />
      )}
      <div className="gradient-bg-top my-8 flex items-center justify-center px-[5.5rem]">
        <div className="-mr-3 min-h-[255px] w-[38%] rounded-lg bg-primary-500 p-8 pl-12 text-white shadow-sm">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold">
              {userProfile.username === userProfile.address
                ? formatAddress(userProfile.username)
                : userProfile.username}
            </h1>
          </div>
          <p className="font-light">{userProfile.bio}</p>
        </div>
        <Tilt
          className="parallax-effect-glare-scale"
          glareEnable={true}
          glareMaxOpacity={1}
          scale={1.02}
        >
          <>
            {isLoadingOnChainProfile && (
              <div className="relative flex h-[425px] w-[380px] cursor-pointer items-center justify-center rounded-lg border-4 border-black bg-gray-500  shadow-xl">
                <div className="h-full w-full animate-pulse bg-gray-400"></div>
              </div>
            )}
            {!onChainProfile?.tokenMetadata && (
              <div className="relative flex h-[425px] w-[380px] cursor-pointer items-center justify-center rounded-lg border-4 border-black bg-gray-400 p-4 shadow-xl">
                <Image
                  src="/images/profileSBT/level1-gray.jpg"
                  alt="sbt"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg opacity-25"
                />
              </div>
            )}
            {sbtImageUrl && (
              <div className="relative flex h-[380px] w-[380px] cursor-pointer items-center justify-center rounded-lg border-4 border-black p-4 shadow-xl">
                <Image
                  loader={() => sbtImageUrl}
                  src={sbtImageUrl}
                  alt="sbt"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
          </>
        </Tilt>
        <div className="-ml-3 min-h-[255px] w-[38%] items-stretch rounded-lg bg-primary-500 p-8 pl-12 text-white shadow-sm">
          <h1 className="text-2xl font-bold">My Tech Stack</h1>
          <div className="grid grid-cols-3 gap-2">
            {userProfile.technologies.map((language) => (
              <TagsPill
                key={`skill-${language.id}`}
                name={language.name}
                classes="justify-self-start"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-6 -mt-1 flex items-center justify-center">
        {session && session.user.address === userProfile.address && (
          <div className="space-y-4">
            <button
              onClick={openModal}
              className="w-full rounded-[6.5px] bg-primary-400 px-10 py-4 font-bold text-white"
            >
              {onChainProfile?.pathChosen ? 'Update' : 'Create'} Profile
            </button>
            {onChainProfile?.['tokenId']?._hex === '0x00' && (
              <button
                disabled={
                  !onChainProfile?.pathChosen ||
                  !mintToken ||
                  isLoadingMintToken
                }
                className="w-full rounded-[6.5px] bg-primary-400 px-10 py-4 font-bold text-white hover:bg-primary-400 disabled:bg-gray-500"
                onClick={() => setMintModalOpen(true)}
              >
                Mint Your SBT
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
