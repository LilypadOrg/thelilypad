import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { SBT_MINT_FEE } from '~/utils/constants';
import {
  MAIN_CONTRACT_ABI,
  MAIN_CONTRACT_ADDRESS,
  SBT_CONTRACT_ADDRESS,
} from '~/utils/contracts';

export const useMintSBT = (address: string, enableMint: boolean) => {
  const { config: mintTokenConfig } = usePrepareContractWrite({
    addressOrName: MAIN_CONTRACT_ADDRESS,
    contractInterface: MAIN_CONTRACT_ABI,
    functionName: 'mintTokenForMember',
    args: [address, SBT_CONTRACT_ADDRESS],
    overrides: {
      value: SBT_MINT_FEE,
    },
    enabled: enableMint,
  });

  const { data: mintTokenRes, write: mintToken } =
    useContractWrite(mintTokenConfig);

  const { isLoading, error, isSuccess } = useWaitForTransaction({
    hash: mintTokenRes?.hash,
  });

  return { mintToken, isLoading, error, isSuccess };
};
