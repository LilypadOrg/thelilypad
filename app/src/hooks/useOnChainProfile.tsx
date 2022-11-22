import { useContractRead } from 'wagmi';
import { OnChainProfile } from '~/types/types';
import {
  getLilyPadABI,
  getLilyPadAddress,
  getPondSBTABI,
  getPondSBTAddress,
} from '~/utils/contracts';
import { trpc } from '~/utils/trpc';

export const useOnChainProfile = (address: string | undefined) => {
  const {
    data: onChainProfile,
    refetch: refetchProfile,
    isLoading: isLoadingOnChainProfile,
  } = useContractRead({
    addressOrName: getLilyPadAddress(),
    contractInterface: getLilyPadABI(),
    functionName: 'getMember',
    enabled: !!address,
    args: address,
    cacheTime: 0,
    staleTime: 0,
    onSuccess: () => {
      console.log('getMember Contract read success');
    },
  });

  const { data: tokenUri, isLoading: isLoadingTokenURI } = useContractRead({
    addressOrName: getPondSBTAddress(),
    contractInterface: getPondSBTABI(),
    functionName: 'tokenURI',
    enabled: !!onChainProfile && onChainProfile.tokenId._hex !== '0x00',
    args: [onChainProfile?.tokenId._hex],
    onSuccess: () => {
      console.log('tokenUri Contract read success');
    },
  });

  const { data: tokenMetadata, isFetching: isLoadingTokenMetadata } =
    trpc.useQuery(
      ['blockend.getTokenMetadata', { tokenUri: tokenUri?.toString() || '' }],
      {
        enabled: !!tokenUri,
        onSuccess: (data) => {
          console.log('tokenMetadata read success');
          console.log(data);
        },
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

  return { data, refetchProfile, isLoading };
};
