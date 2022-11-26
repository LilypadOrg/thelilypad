import { useContractRead } from 'wagmi';
import { getLilyPadTreasure, getLilyPadTreasureABI } from '~/utils/contracts';

export const useDAOTreasure = () => {
  const {
    data: treasureValue,
    refetch: refetchProfile,
    isLoading: isLoadingTreasureValue,
  } = useContractRead({
    addressOrName: getLilyPadTreasure(),
    contractInterface: getLilyPadTreasureABI(),
    functionName: 'daoTreasure',
    enabled: true,
    args: [],
    onSuccess: (data) => {
      console.log(`LilyPad Treasure Read: ${data.toString()} wei`);
    },
  });

  return { treasureValue, refetchProfile, isLoadingTreasureValue };
};
