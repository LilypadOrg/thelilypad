import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { SBT_MINT_FEE } from '~/utils/constants';
import { getLilyPadAddress, getLilyPadABI } from '~/utils/contracts';
import { api } from '~/utils/api';

export const useMintSBT = (address: string, enableMint: boolean) => {
  const { config: mintTokenConfig } = usePrepareContractWrite({
    address: getLilyPadAddress(),
    abi: getLilyPadABI(),
    functionName: 'mintTokenForMember',
    args: [address as `0x${string}`],
    overrides: {
      value: SBT_MINT_FEE,
    },
    enabled: enableMint,
  });

  const { data: mintTokenRes, write: mintToken } =
    useContractWrite(mintTokenConfig);

  const { mutate: upadteHasPondSBT } = api.users.setHasPondSbt.useMutation();

  const { isLoading, error, isSuccess } = useWaitForTransaction({
    hash: mintTokenRes?.hash,
    onSuccess: () => {
      upadteHasPondSBT({ hasPondSBT: true });
    },
  });

  return { mintToken, isLoading, error, isSuccess };
};
