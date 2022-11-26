import { useContractRead } from 'wagmi';
import Web3 from 'web3';
import { getLilyPadTreasure, getLilyPadTreasureABI } from '~/utils/contracts';
import { trpc } from '~/utils/trpc';

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
