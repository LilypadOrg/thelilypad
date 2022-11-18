import { ethers, network, upgrades, deployments } from "hardhat";
import { fronEndABIsDir, frontEndContractsFile } from "../helper-hardhat.config";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { LilyPadTreasure__factory } from "../typechain-types";
import fs from "fs";

const BASE_FEE = ethers.utils.parseEther("0.05");

// Calculated value based on the gas price on the chain
const GAS_PRICE_LINK = 1e9;

const updateApp: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    console.log("Updating app ABI's and addresses...");
    const chainId = network.config.chainId!;

    const LilyPadContract = await ethers.getContract("LilyPad");
    const LilyPadTreasureContract = await ethers.getContract("LilyPadTreasure");
    const PondSBTContract = await ethers.getContract("PondSBT");
    const LilyPadExecutorContract = await ethers.getContract("LilyPadExecutor");
    const LilyPadGovernorContract = await ethers.getContract("LilyPadGovernor");

    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"));

    await updateContractInFrontEnd(contractAddresses, chainId, "LilyPad", LilyPadContract.address);
    await updateContractInFrontEnd(contractAddresses, chainId, "PondSBT", PondSBTContract.address);
    await updateContractInFrontEnd(
        contractAddresses,
        chainId,
        "LilyPadTreasure",
        LilyPadTreasureContract.address
    );
    await updateContractInFrontEnd(
        contractAddresses,
        chainId,
        "LilyPadExecutor",
        LilyPadExecutorContract.address
    );
    await updateContractInFrontEnd(
        contractAddresses,
        chainId,
        "LilyPadGovernor",
        LilyPadGovernorContract.address
    );

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
    console.log("Front end written!");
};

async function updateContractInFrontEnd(
    jsonObj: any,
    chainId: number,
    contract: string,
    address: string
) {
    console.log(`Writing ${contract} address (${address}) to frontend file (ChainId: ${chainId})`);

    const contractArtifact = await deployments.getArtifact(contract);
    fs.writeFileSync(`${fronEndABIsDir}/${contract}.json`, JSON.stringify(contractArtifact));

    if (chainId in jsonObj) {
        if (jsonObj[chainId].filter((item: any) => item.contract == contract).length <= 0) {
            jsonObj[chainId].push({
                contract: contract,
                address: address,
            });
        } else {
            jsonObj[chainId].filter((item: any) => item.contract == contract)[0].address = address;
        }
    } else {
        jsonObj[chainId] = [
            {
                contract: contract,
                address: address,
            },
        ];
    }
}

export default updateApp;

updateApp.tags = ["all", "update-app"];
