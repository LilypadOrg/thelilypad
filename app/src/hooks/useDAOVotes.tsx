import { useContractRead } from 'wagmi';
import { getPondSBTABI, getPondSBTAddress } from '~/utils/contracts';

export const useDAOVotes = (account: string) => {
  const {
    data: votes,
    refetch: refetchProfile,
    isLoading: isLoadingUserVotes,
  } = useContractRead({
    address: getPondSBTAddress(),
    abi: getPondSBTABI(),
    functionName: 'getVotes',
    args: [account as `0x${string}`],
    enabled: true,
  });

  return { votes, refetchProfile, isLoadingUserVotes };
};
