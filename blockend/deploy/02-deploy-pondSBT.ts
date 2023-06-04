import { ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { currentNetWork, encode_function_data, verifyContractFile } from "../scripts/utils";
import {
    LilyPad__factory,
    PondSBTProxyAdmin__factory,
    PondSBTProxy__factory,
    PondSBT__factory,
} from "../typechain-types";
import { networkConfig } from "../helper-hardhat.config";

const BASE_FEE = ethers.utils.parseEther("0.05");

// Calculated value based on the gas price on the chain
const GAS_PRICE_LINK = 1e9;

const deployPondSBT: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, web3 } = hre;
    const { deploy, log, save, get } = deployments;

    const { deployer, safeCaller } = await getNamedAccounts();
    const { chainId } = network.config;

    //deploy implementation
    const pondSbtFactory: PondSBT__factory = await ethers.getContractFactory("PondSBT");
    var pondSbtContract = await pondSbtFactory.deploy();
    await pondSbtContract.deployed();

    console.log(`Pond SBT deployed to ${pondSbtContract.address}`);

    if ((networkConfig[currentNetWork()].verify ?? false) && process.env.ETHERSCAN_API_KEY) {
        console.log("Awaiting 6 blocks to send PondSBT verification request...");
        await pondSbtContract.deployTransaction.wait(6);

        await verifyContractFile(pondSbtContract.address, "contracts/PondSBT.sol:PondSBT", []);
    }

    //deploy proxy admin
    const proxyAdminFactory: PondSBTProxyAdmin__factory = await ethers.getContractFactory(
        "PondSBTProxyAdmin"
    );
    const pondSBTProxyAdminContract = await proxyAdminFactory.deploy();
    await pondSBTProxyAdminContract.deployed();

    console.log(`PondSBTProxyAdmin deployed to ${pondSBTProxyAdminContract.address}`);

    if ((networkConfig[currentNetWork()].verify ?? false) && process.env.ETHERSCAN_API_KEY) {
        console.log("Awaiting 6 blocks to send PondSBTProxyAdmin verification request...");
        await pondSBTProxyAdminContract.deployTransaction.wait(6);

        await verifyContractFile(
            pondSBTProxyAdminContract.address,
            "contracts/proxy/PondSBTProxyAdmin.sol:PondSBTProxyAdmin",
            []
        );
    }

    //deploy proxy
    const encoded_initializer = encode_function_data();

    const proxyFactory: PondSBTProxy__factory = await ethers.getContractFactory("PondSBTProxy");
    const PondSBTProxyContract = await proxyFactory.deploy(
        pondSbtContract.address,
        pondSBTProxyAdminContract.address,
        encoded_initializer
    );
    await PondSBTProxyContract.deployed();

    console.log(`PondSBTProxy deployed to ${PondSBTProxyContract.address}`);

    if ((networkConfig[currentNetWork()].verify ?? false) && process.env.ETHERSCAN_API_KEY) {
        console.log("Awaiting 6 blocks to send PondSBTProxy verification request...");
        await PondSBTProxyContract.deployTransaction.wait(6);

        await verifyContractFile(
            PondSBTProxyContract.address,
            "contracts/proxy/PondSBTProxy.sol:PondSBTProxy",
            [pondSbtContract.address, pondSBTProxyAdminContract.address, encoded_initializer]
        );
    }

    //get instance of contract
    pondSbtContract = await pondSbtFactory.attach(PondSBTProxyContract.address);
    //get backbone deployed
    const lilyPadContract = await get("LilyPadProxy");
    const lilyPadFactory: LilyPad__factory = await ethers.getContractFactory("LilyPad");
    const lilyPadInstance = lilyPadFactory.attach(lilyPadContract.address);

    console.log(`Lilypad Contract: ${lilyPadContract.address}`);
    //initialize proxy
    const devsFeePerc = 5;
    var tx = await pondSbtContract.initialize(BASE_FEE, devsFeePerc, lilyPadContract.address);
    const txReceipt = await tx.wait(1);

    console.log(`Dev Percentage: ${await pondSbtContract.devPerc()}`);
    //set sbt address to LilyPad Contract
    const setSbtTx = await lilyPadInstance.setSbtAddress(PondSBTProxyContract.address);
    await setSbtTx.wait(1);

    console.log(`Sbt Contract set in LilyPad: ${await lilyPadInstance.sbtAddress()}`);

    console.log(`Backbone set on PondSBT contract: ${await pondSbtContract.mainContract()}`);
    const pondSBTArtifact = await deployments.getArtifact("PondSBT");
    const pondSBTProxyArtifact = await deployments.getArtifact("PondSBTProxy");
    const pondSBTProxyAdminArtifact = await deployments.getArtifact("PondSBTProxyAdmin");

    await save("PondSBT", {
        address: pondSbtContract.address,
        ...pondSBTArtifact,
    });

    await save("PondSBTProxy", {
        address: PondSBTProxyContract.address,
        ...pondSBTProxyArtifact,
    });

    await save("PondSBTProxyAdmin", {
        address: pondSBTProxyAdminContract.address,
        ...pondSBTProxyAdminArtifact,
    });
};

export default deployPondSBT;

deployPondSBT.tags = ["all", "lily-pad"];
