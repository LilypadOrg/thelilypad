import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { Session } from 'next-auth';
import { getLilyPadAddress, getLilyPadABI } from '~/utils/contracts';
import { api } from '~/utils/api';
import { useOnChainProfile } from '~/hooks/useOnChainProfile';
import LevelUpModal from './LevelUpModal';
import { useState } from 'react';
import { getSBTLocalURL } from '~/utils/formatters';
import { BigNumber } from 'ethers';

export const CompleteCourse = ({
  user,
  courseId,
  completed,
}: {
  user: Session['user'];
  courseId: number;
  completed: boolean;
}) => {
  const utils = api.useContext();
  const [levelUpModal, setLevelUpModal] = useState<{
    prevSBT: string;
    currSBT: string;
    show: boolean;
    newLevel: number;
  }>({ prevSBT: '', currSBT: '', show: false, newLevel: 0 });

  const { data: onChainProfile } = useOnChainProfile(user?.address);

  const { data: completeEventSignature } =
    api.blockend.signCompleteEvent.useQuery(
      {
        address: user.address,
        courseId: courseId,
      },
      {
        enabled:
          !!onChainProfile && (onChainProfile as any).pathChosen && !completed,
      }
    );

  const { config: completeCourseConfig } = usePrepareContractWrite({
    address: getLilyPadAddress(),
    abi: getLilyPadABI(),
    functionName: 'completeEvent',
    args: [
      user.address as `0x${string}`,
      BigNumber.from(courseId),
      completeEventSignature as `0x${string}`,
    ],
    enabled: !!completeEventSignature,
  });

  const { data: completeCourseRes, write: completeCourse } =
    useContractWrite(completeCourseConfig);

  const { isLoading: isLoadingCompleteCourse } = useWaitForTransaction({
    hash: completeCourseRes?.hash,
    onSuccess: async () => {
      setCompleted();
    },
  });

  const { mutate: mutateCompleted, isLoading: isLoadingMutateCompleted } =
    api.usercourses.complete.useMutation({
      onSuccess: (data) => {
        if ((onChainProfile as any)?.pathChosen && data.levelUp) {
          setLevelUpModal({
            prevSBT: getSBTLocalURL(data.user.levelNumber - 1),
            currSBT: getSBTLocalURL(data.user.levelNumber),
            show: true,
            newLevel: data.user.levelNumber,
          });
        }
        // utils.refetchQueries(['usercourses.all', { userId: user.userId }]);
        utils.courses.byId.refetch({ id: courseId });
        utils.users.byAddress.refetch({ address: user.address });
        if (user.name) {
          utils.users.byUsername.refetch({ username: user.name });
        }
      },
    });

  const setCompleted = async () => {
    mutateCompleted({
      courseId: courseId,
    });
  };

  const handleSetCompleted = async () => {
    if (completeCourse) {
      completeCourse();
    } else {
      setCompleted();
    }
  };

  const isLoading = isLoadingCompleteCourse || isLoadingMutateCompleted;

  // const tokenMetadata = onChainProfile?.tokenMetadata;

  // useEffect(() => {
  //   if (tokenMetadata) {
  //     const sbtURL = tokenMetadata.image
  //       .replace('ipfs:', 'https:')
  //       .concat('.ipfs.nftstorage.link/');
  //     console.log('sbtURL');
  //     console.log(sbtURL);
  //     console.log('prevSBT');
  //     console.log(prevSBT);
  //     console.log('currSBT');
  //     console.log(currSBT);
  //     if (sbtURL !== currSBT) {
  //       setPrevSBT(currSBT);
  //       setCurrSBT(sbtURL);
  //     }
  //   }
  // }, [tokenMetadata]);

  // useEffect(() => {
  //   if (prevSBT && currSBT) {
  //     setLevelUpModalOpen(true);
  //   }
  // }, [prevSBT, currSBT]);

  const closeLevelUpModal = () => {
    setLevelUpModal((prev) => ({ ...prev, show: false }));
  };

  return (
    <>
      {levelUpModal.show && (
        <LevelUpModal
          open={levelUpModal.show}
          closeModal={closeLevelUpModal}
          prevSBT={levelUpModal.prevSBT}
          currSBT={levelUpModal.currSBT}
          reachedLevel={levelUpModal.newLevel}
        />
      )}
      <div>
        <button
          disabled={isLoadingCompleteCourse || completed}
          onClick={handleSetCompleted}
          className="mt-8 w-full rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
        >
          {isLoading && 'Loading...'}
          {completed && 'Course completed'}
          {!isLoading && !completed && 'Mark course as complete'}
        </button>
      </div>
    </>
  );
};
