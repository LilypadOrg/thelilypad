import { BigNumberish, ethers } from "ethers";

export interface networkConfigItem {
    verify?: boolean;
    blockConfirmations?: number;
    VRFCoordinatorV2: string;
    // entranceFee: BigNumberish;
    gasLane: string;
    callBackGasLimit: string;
    interval: string;
    subscriptionId?: string;
    votingDelay: number;
    votingPeriod: number;
    levelThreshold: number;
    executorMinDelay: number;
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem;
}

const networkConfig: networkConfigInfo = {
    5: {
        verify: true,
        blockConfirmations: 6,
        // entranceFee: ethers.utils.parseEther("0.01"),
        VRFCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callBackGasLimit: "500000",
        interval: "120",
        subscriptionId: "505",
        votingDelay: 6545 /* 6545 blocks (~1 day) */,
        votingPeriod: 45818 /* 45818 blocks (~1 week) */,
        levelThreshold: 1,
        executorMinDelay: 86400 /*86400 seconds (1 day) */,
    },
    1337: {
        verify: false,
        blockConfirmations: 1,
        // entranceFee: ethers.utils.parseEther("0.01"),
        VRFCoordinatorV2: "0x0000",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callBackGasLimit: "500000",
        interval: "30",
        votingDelay: 6545 /* 6545 blocks (~1 day) */,
        votingPeriod: 45818 /* 45818 blocks (~1 week) */,
        levelThreshold: 1,
        executorMinDelay: 300 /*300 seconds (5 minutes) */,
    },
    80001: {
        verify: true,
        blockConfirmations: 6,
        // entranceFee: ethers.utils.parseEther("0.01"),
        VRFCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callBackGasLimit: "500000",
        interval: "120",
        subscriptionId: "505",
        votingDelay: 6545 /* 6545 blocks (~1 day) */,
        votingPeriod: 45818 /* 45818 blocks (~1 week) */,
        levelThreshold: 1,
        executorMinDelay: 86400 /*86400 seconds (1 day) */,
    },
};

const developmentChains = ["hardhat", "localhost"];
const frontEndContractsFile = "../app/src/utils/contracts/contractAddresses.json";
const fronEndABIsDir = "../app/src/utils/contracts";

export { networkConfig, developmentChains, frontEndContractsFile, fronEndABIsDir };
