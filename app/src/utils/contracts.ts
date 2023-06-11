import contractAddresses from './contracts/contractAddresses.json';
import { wagmiClient } from './rainbowkit';
// import LiLyPadContract from './contracts/LilyPad.json';
//import LiLyPadContract from './contracts/LilyPad';
// import PondSBTContract from './contracts/PondSBT.json';
import PondSBTContract from './contracts/PondSBT';
// import LilyPadTreasureContract from './contracts/LilyPadTreasure.json';
import LilyPadTreasureContract from './contracts/LilyPadTreasure.json';
import LilyPadGovernorContract from './contracts/LilyPadGovernor.json';
import LilyPadExecutorContract from './contracts/LilyPadExecutor.json';
import LilyPadAbi from './contracts/LilyPad';

const addresses: {
  [key: number]: Array<{ contract: string; address: string }>;
} = contractAddresses;

// TODO: make chain dynamic
const getChainId = () => {
  return wagmiClient.lastUsedChainId || 1337;
};

const getContractAddress = (contractName: string) => {
  const chainId = getChainId();
  const contractData = addresses[chainId] || addresses[1337];

  const contractAddress = contractData.find(
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

export const getLilyPadTreasure = () => {
  return getContractAddress('LilyPadTreasure');
};

export const getLilyPadGovernorAddress = () => {
  return getContractAddress('LilyPadGovernor');
};

export const getLilyPadExecutorAddress = () => {
  return getContractAddress('LilyPadExecutor');
};

export const getLilyPadABI = () => {
  // return LiLyPadContract.abi;
  return LilyPadAbi;
  // return LiLyPadContract.abi;
};

export const getPondSBTABI = () => {
  // return PondSBTContract.abi;
  return PondSBTContract;
};

export const getLilyPadTreasureABI = () => {
  // return LilyPadTreasureContract.abi;
  return LilyPadTreasureContract.abi;
};

export const getLilyPadGovernorABI = () => {
  return LilyPadGovernorContract.abi;
};

export const getLilyPadExecutorABI = () => {
  return LilyPadExecutorContract.abi;
};
