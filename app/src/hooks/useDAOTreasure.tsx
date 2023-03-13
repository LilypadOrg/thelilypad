import { useContractRead } from 'wagmi';
import { getLilyPadTreasure, getLilyPadTreasureABI } from '~/utils/contracts';

export const useDAOTreasure = () => {
  const {
    data: treasureValue,
    refetch: refetchProfile,
    isLoading: isLoadingTreasureValue,
    error,
  } = useContractRead({
    address: getLilyPadTreasure(),
    abi: getLilyPadTreasureABI(),
    functionName: 'daoTreasure',
    enabled: true,
  });

  console.log({ error });

  return { treasureValue, refetchProfile, isLoadingTreasureValue };
};
