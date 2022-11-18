import { useContractRead } from 'wagmi';
import { OnChainProfile } from '~/types/types';
import {
  MAIN_CONTRACT_ABI,
  MAIN_CONTRACT_ADDRESS,
  SBT_CONTRACT_ABI,
  SBT_CONTRACT_ADDRESS,
} from '~/utils/contracts';
import { trpc } from '~/utils/trpc';

export const useOnChainProfile = (address: string | undefined) => {
  const {
    data: onChainProfile,
    refetch,
    isLoading: isLoadingOnChainProfile,
  } = useContractRead({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'getMember',
    enabled: !!address,
    args: address,
    cacheTime: 0,
    staleTime: 0,
  });

  const { data: tokenUri, isLoading: isLoadingTokenURI } = useContractRead({
    addressOrName: SBT_CONTRACT_ADDRESS,
    contractInterface: SBT_CONTRACT_ABI,
    functionName: 'tokenURI',
    enabled: !!onChainProfile && onChainProfile.tokenId._hex !== '0x00',
    args: [onChainProfile?.tokenId._hex],
  });

  const { data: tokenMetadata, isFetching: isLoadingTokenMetadata } =
    trpc.useQuery(
      ['blockend.getTokenMetadata', { tokenUri: tokenUri?.toString() || '' }],
      {
        enabled: !!tokenUri,
      }
    );

  const isLoading =
    isLoadingOnChainProfile || isLoadingTokenMetadata || isLoadingTokenURI;

  const data: OnChainProfile | undefined = onChainProfile
    ? {
        DAO: !!onChainProfile?.DAO,
        pathChosen: !!onChainProfile?.pathChosen,
        xp: onChainProfile?.xp,
        level: onChainProfile?.level,
        tokenId: onChainProfile?.tokenId,
        tokenUri: tokenUri?.toString(),
        tokenMetadata,
        sbtImageUrl: tokenMetadata?.image
          .replace('ipfs:', 'https:')
          .concat('.ipfs.nftstorage.link/'),
      }
    : undefined;

  console.log('onChainProfile');
  console.log(data);

  return { data, refetch, isLoading };
};
