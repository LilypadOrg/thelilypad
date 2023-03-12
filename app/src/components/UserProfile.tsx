import { useState } from 'react';
import { UserProfile as UserProfileType } from '~/types/types';
import { formatAddress, getSBTLocalURL } from '~/utils/formatters';
import EditProfileModal from './EditProfileModal';
import MintSBTModal from './MintSBTModal';
import Tilt from 'react-parallax-tilt';
import Image from 'next/image';
import TagsPill from './TagsPill';
import { useSession } from 'next-auth/react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { useConfetti } from '~/hooks/useConfetti';

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

  const openModal = () => {
    setEditModalOpen(true);
    setEditModalMode(userProfile.hasOnChainProfile ? 'update' : 'create');
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const closeMintModal = (isSuccess = false) => {
    setMintModalOpen(false);
    if (isSuccess) {
      fireCelebration();
    }
  };

  const sbtImageUrl = userProfile.hasPondSBT
    ? getSBTLocalURL(userProfile.level.number)
    : getSBTLocalURL(0);

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
          address={userProfile.address}
        />
      )}
      <div className="gradient-bg-top my-8 flex items-center justify-center px-[5.5rem]">
        <div className="-mr-3 hidden min-h-[255px] w-[38%] rounded-sm bg-primary-500 p-8 pl-12 text-white shadow-sm lg:block">
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
            {/* {isLoadingOnChainProfile && (
              <div className="relative flex h-[325px] w-[280px]  cursor-pointer items-center justify-center rounded-sm border-4 border-black bg-gray-500 shadow-xl lg:h-[425px]  lg:w-[380px]">
                <div className="h-full w-full animate-pulse bg-gray-400"></div>
              </div>
            )} */}
            {/* {!userProfile.hasPondSBT && (
              <div className="relative flex h-[325px] w-[280px]  cursor-pointer items-center justify-center rounded-sm border-4 border-black bg-gray-400 p-4 shadow-xl lg:h-[425px] lg:w-[380px]">
                <Image
                  src="/images/profileSBT/level1-gray.jpg"
                  alt="sbt"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-sm opacity-25"
                />
              </div>
            )} */}
            {/* {userProfile.hasPondSBT && ( */}
            <div className="relative flex h-[380px] w-[380px] cursor-pointer items-center justify-center rounded-sm border-4 border-black p-4 shadow-xl">
              <Image
                // loader={() => sbtImageUrl}
                src={sbtImageUrl}
                alt="sbt"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
            {/* )} */}
          </>
        </Tilt>
        <div className="-ml-3 hidden min-h-[255px] w-[38%] items-stretch rounded-sm bg-primary-500 p-8 pl-12 text-white shadow-sm lg:block">
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
              className="btn-primary text-xl font-semibold leading-4 tracking-wide text-white"
            >
              {userProfile.hasOnChainProfile ? 'Update' : 'Create'} Profile
            </button>
            {userProfile.hasOnChainProfile && !userProfile.hasPondSBT && (
              <button
                className="btn-primary text-xl font-semibold leading-4 tracking-wide text-white"
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
