import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useContractRead } from 'wagmi';
import {
  MAIN_CONTRACT_ABI,
  MAIN_CONTRACT_ADDRESS,
  SBT_CONTRACT_ABI,
  SBT_CONTRACT_ADDRESS,
} from '~/utils/contracts';

interface OnChainProfile {
  DAO: boolean;
  pathChosen: boolean;
  xp: BigNumber;
  level: BigNumber;
  tokenId: BigNumber;
  tokenUri: string | undefined | null;
  badges?: Array<string>;
  completedEvents?: Array<number>;
  tokenMetadata:
    | {
        image: string;
        name: string;
        description: string;
      }
    | undefined;
  sbtImageUrl: string | undefined | null;
}

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
  });

  const { data: tokenUri, isLoading: isLoadingTokenURI } = useContractRead({
    addressOrName: SBT_CONTRACT_ADDRESS,
    contractInterface: SBT_CONTRACT_ABI,
    functionName: 'tokenURI',
    enabled: onChainProfile?.tokenId._hex !== '0x00',
    args: [onChainProfile?.tokenId._hex],
  });

  console.log('tokenUri');
  console.log(tokenUri);

  const { data: tokenMetadata, isFetching: isLoadingTokenMetadata } = useQuery(
    ['tokenMetadata', tokenUri],
    async () => {
      const data = await (await fetch(tokenUri?.toString() || '')).json();
      return data;
    },
    { enabled: !!tokenUri }
  );

  const isLoading =
    isLoadingOnChainProfile || isLoadingTokenMetadata || isLoadingTokenURI;

  const data: OnChainProfile | undefined = isLoading
    ? undefined
    : {
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
      };

  return { data, refetch, isLoading };
};
