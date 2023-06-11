import { ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { LilyPadTreasure__factory } from "../typechain-types";
import { currentNetWork, verifyContractFile } from "../scripts/utils";
import { networkConfig } from "../helper-hardhat.config";

const BASE_FEE = ethers.utils.parseEther("0.05");

// Calculated value based on the gas price on the chain
const GAS_PRICE_LINK = 1e9;

const deployLilyPadTreasure: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments } = hre;
    const { save, get } = deployments;

    const daoExecutor = await get("LilyPadExecutor");

    //deploy Treasure
    const treasuryFactory: LilyPadTreasure__factory = await ethers.getContractFactory(
        "LilyPadTreasure"
    );
    const treasureContract = await upgrades.deployProxy(treasuryFactory, [daoExecutor.address]);
    await treasureContract.deployed();

    console.log(`LilyPad Treasure (Proxy) deployed to ${treasureContract.address}`);
    console.log(
        await upgrades.erc1967.getImplementationAddress(treasureContract.address),
        " getImplementationAddress"
    );
    console.log(
        await upgrades.erc1967.getAdminAddress(treasureContract.address),
        " getAdminAddress"
    );

    //verify
    if ((networkConfig[currentNetWork()].verify ?? false) && process.env.ETHERSCAN_API_KEY) {
        console.log("Awaiting 6 blocks to send LilyPadTreasure verification request...");
        await treasureContract.deployTransaction.wait(6);

        await verifyContractFile(
            treasureContract.address,
            "contracts/LilyPadTreasure.sol:LilyPadTreasure",
            []
        );
    }

    //set treasure address to SBT Contract
    console.log("Setting treasure address to SBT Contract...");
    const pondSBTFactory = await ethers.getContractFactory("PondSBT");
    const pondSBT = await get("PondSBTProxy");

    const pondSBTContract = await pondSBTFactory.attach(pondSBT.address);

    const setContractTx = await pondSBTContract.setTreasureAddress(treasureContract.address);
    await setContractTx.wait(1);

    console.log(`Treasure set to SBT Contract: ${await pondSBTContract.lilyPadTreasure()}`);

    const artifact = await deployments.getArtifact("LilyPadTreasure");

    await save("LilyPadTreasure", {
        address: treasureContract.address,
        ...artifact,
    });
};

export default deployLilyPadTreasure;

deployLilyPadTreasure.tags = ["all", "lily-pad-treasure"];
