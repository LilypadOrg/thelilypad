import { NextPage } from 'next';
import { toast } from 'react-toastify';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useQuery,
  useWaitForTransaction,
} from 'wagmi';
import { trpc } from '~/utils/trpc';
import {
  MAIN_CONTRACT_ADDRESS,
  MAIN_CONTRACT_ABI,
  SBT_CONTRACT_ADDRESS,
  SBT_CONTRACT_ABI,
} from '~/utils/contracts';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import {
  SBT_MINT_FEE,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '~/utils/constants';

const Profile: NextPage = () => {
  const { data: session } = useSession();
  const [newUsername, setNewUsername] = useState<string>('');
  const utils = trpc.useContext();
  const router = useRouter();
  const username = router.query.username as string | undefined;

  const { data: userProfile, isLoading: isLoadingProfile } = trpc.useQuery(
    ['users.byUsername', { username: username! }],
    { enabled: !!username }
  );

  const { data: createMemberSignature, error } = trpc.useQuery(
    [
      'blockend.signCreateMember',
      {
        name: userProfile?.name || '',
        xp: userProfile?.xp || 0,
        courses: userProfile?.courses.map((c) => c.course.id) || [],
      },
    ],
    {
      enabled: !!userProfile,
      onSuccess: (data) => {
        console.log('singnature');
        console.log(data);
      },
    }
  );

  const {
    data: onChainProfile,
    refetch: refetchGetMember,
    isLoading: isLoadingOnchainProfile,
  } = useContractRead({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'getMember',
    enabled: !!session?.user,
    args: [session?.user.address],
  });

  console.log('onChainProfile');
  console.log(onChainProfile);

  const { config: createMemberConfig } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'createMember',
    args: [
      ethers.utils.toUtf8CodePoints(userProfile?.name || ''), // _name
      userProfile?.xp, // _initialXP
      userProfile?.courses.map((c) => c.course.id), // -completedEvents
      [], // _badges
      createMemberSignature, // _sig
    ],
    enabled: !!userProfile && !!createMemberSignature,
  });

  console.log('error');
  console.log(error);

  const { data: createMemberRes, write: createMember } =
    useContractWrite(createMemberConfig);

  const { isLoading: isLoadingCreateMember } = useWaitForTransaction({
    hash: createMemberRes?.hash,
    onSuccess: () => {
      refetchGetMember();
    },
  });

  const { config: mintTokenConfig } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'mintTokenForMember',
    args: [session?.user.address, SBT_CONTRACT_ADDRESS],
    overrides: {
      value: SBT_MINT_FEE,
    },
    enabled: onChainProfile?.pathChosen,
  });
  const { data: mintTokenRes, write: mintToken } =
    useContractWrite(mintTokenConfig);

  const { isLoading: isLoadingMintToken } = useWaitForTransaction({
    hash: mintTokenRes?.hash,
    onSuccess: () => {
      refetchGetMember();
    },
  });

  const { data: tokenUri } = useContractRead({
    addressOrName: SBT_CONTRACT_ADDRESS,
    contractInterface: SBT_CONTRACT_ABI,
    functionName: 'tokenURI',
    enabled: onChainProfile?.tokenId._hex !== '0x00',
    args: [onChainProfile?.tokenId._hex],
    onSuccess: (data) => {
      console.log('Data URI');
      console.log(data);
    },
  });

  // if (tokenUri) {
  //   console.log('tokenUri');
  //   // @ts-ignore
  //   console.log(JSON.parse(Buffer.from(tokenUri.substring(29), 'base64')));
  // }

  useQuery(
    ['tokenMetadata', tokenUri],
    () =>
      fetch(tokenUri?.toString() || '').then((res) => console.log(res.json())),
    {
      enabled: !!tokenUri,
      onSuccess: (data) => {
        console.log('Token Data');
        console.log(data);
      },
    }
  );

  const completedCourses = userProfile?.courses.filter(
    (c) => c.completed === true
  );

  const enrolledCourses = userProfile?.courses.filter(
    (c) => c.completed === false && c.enrolled === true
  );

  const handleProfileCreation = () => {
    if (createMember) createMember({});
  };

  const updateUsername = trpc.useMutation(['users.updateUsername'], {
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      utils.invalidateQueries(['users.byUsername', { username: newUsername }]);
      router.replace(`/profiles/${newUsername}`);
    },
  });

  const handleSaveUsername = () => {
    updateUsername.mutate({ username: newUsername });
  };

  return (
    <div>
      {isLoadingProfile && <div>Loading profile...</div>}
      {!isLoadingProfile && !userProfile && <div>Profile not found</div>}
      {userProfile && (
        <>
          <div>{userProfile.name}</div>
          {userProfile.name === userProfile.address && (
            <div>
              <input
                type="text"
                value={newUsername}
                placeholder="Chose a name"
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button
                disabled={
                  newUsername.length < USERNAME_MIN_LENGTH ||
                  newUsername.length > USERNAME_MAX_LENGTH
                }
                onClick={handleSaveUsername}
              >
                Save Username
              </button>
              {(newUsername && newUsername.length <= USERNAME_MIN_LENGTH) ||
                (newUsername.length > USERNAME_MAX_LENGTH && (
                  <div className="text-red-500">
                    Username must be between 3 and 42 characters
                  </div>
                ))}
            </div>
          )}
          {isLoadingOnchainProfile && <div>Loading on-chain profile...</div>}
          {!onChainProfile?.pathChosen && (
            <div>
              <div>You do not have an on-chain profile yet!</div>
              {userProfile.address === userProfile.name ? (
                <div>
                  To create your on-chain profile, first choose a username.
                </div>
              ) : (
                <button
                  className="border-1"
                  disabled={!createMember}
                  onClick={handleProfileCreation}
                >
                  {isLoadingCreateMember ? 'Creating...' : 'Create profile'}
                </button>
              )}
            </div>
          )}
          {onChainProfile?.pathChosen &&
            onChainProfile['tokenId']._hex === '0x00' && (
              <div>
                <div>{onChainProfile['name']}, you do not have an SBT yet.</div>
                <button onClick={() => mintToken?.()}>
                  {isLoadingMintToken ? 'Loading...' : 'Get SBT'}
                </button>
              </div>
            )}
          {onChainProfile?.pathChosen &&
            onChainProfile['tokenId']._hex !== '0x00' && (
              <div>
                {/* TODO: create type for onChainProfile */}
                <div>SBT tokenID: {onChainProfile['tokenId'].toString()}</div>
              </div>
            )}

          <div>XP: {userProfile?.xp}</div>
          <div>Level: {userProfile?.level.number}</div>
          <h6>Completed Courses</h6>
          {completedCourses && completedCourses.length > 0 ? (
            completedCourses.map(({ course }) => (
              <div key={course.id}>{course.title}</div>
            ))
          ) : (
            <div>Yo have not completed any course</div>
          )}
          <h6>Enrolled Courses</h6>
          {enrolledCourses && enrolledCourses.length > 0 ? (
            enrolledCourses.map(({ course }) => (
              <div key={course.id}>{course.title}</div>
            ))
          ) : (
            <div>You are not enrolled in any course</div>
          )}
        </>
      )}
    </div>
  );
};
export default Profile;
