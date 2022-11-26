import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { SBT_MINT_FEE } from '~/utils/constants';
import { getLilyPadAddress, getLilyPadABI } from '~/utils/contracts';
import { trpc } from '~/utils/trpc';

export const useMintSBT = (address: string, enableMint: boolean) => {
  const { config: mintTokenConfig } = usePrepareContractWrite({
    addressOrName: getLilyPadAddress(),
    contractInterface: getLilyPadABI(),
    functionName: 'mintTokenForMember',
    args: [address],
    overrides: {
      value: SBT_MINT_FEE,
    },
    enabled: enableMint,
  });

  const { data: mintTokenRes, write: mintToken } =
    useContractWrite(mintTokenConfig);

  const { mutate: upadteHasPondSBT } = trpc.useMutation([
    'users.setHasPondSBT',
  ]);

  const { isLoading, error, isSuccess } = useWaitForTransaction({
    hash: mintTokenRes?.hash,
    onSuccess: () => {
      upadteHasPondSBT({ hasPondSBT: true });
    },
  });

  return { mintToken, isLoading, error, isSuccess };
};
