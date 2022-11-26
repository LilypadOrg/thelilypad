import contractAddresses from './contracts/contractAddresses.json';
import { wagmiClient } from './rainbowkit';
import LiLyPadContract from './contracts/LilyPad.json';
import PondSBTContract from './contracts/PondSBT.json';

const addresses: {
  [key: number]: Array<{ contract: string; address: string }>;
} = contractAddresses;

// TODO: make chain dynamic
const getChainId = () => {
  return wagmiClient.lastUsedChainId || 1337;
};

const getContractAddress = (contractName: string) => {
  const chainId = getChainId();

  contractAddresses[1337];
  const contractAddress = addresses[chainId].find(
    (c) => c.contract === contractName
  )?.address;

  if (!contractAddress)
    throw new Error(
      `No contract address found for ${contractName} on ${chainId}`
    );

  return contractAddress;
};

export const getLilyPadAddress = () => {
  return getContractAddress('LilyPad');
};

export const getPondSBTAddress = () => {
  return getContractAddress('PondSBT');
};

export const getLilyPadABI = () => {
  return LiLyPadContract.abi;
};

export const getPondSBTABI = () => {
  return PondSBTContract.abi;
};
