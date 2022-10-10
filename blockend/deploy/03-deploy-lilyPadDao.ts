import { ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { LilyPadExecutor__factory, LilyPadGovernor__factory } from "../typechain-types";

const deployLilyPadDao: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, web3 } = hre;
    const { deploy, log, save, get } = deployments;

    const { deployer, safeCaller } = await getNamedAccounts();
    const { chainId } = network.config;

    const minDelay = 500;
    const proposers: any[] = [];
    const executors: any[] = [];

    //deploy Dao Executor
    const executorFactory: LilyPadExecutor__factory = await ethers.getContractFactory(
        "LilyPadExecutor"
    );
    const executorContract = await upgrades.deployProxy(executorFactory, [
        minDelay,
        proposers,
        executors,
    ]);
    await executorContract.deployed();

    console.log(`LilyPad Executor (Proxy) deployed to ${executorContract.address}`);
    console.log(
        await upgrades.erc1967.getImplementationAddress(executorContract.address),
        " getImplementationAddress"
    );
    console.log(
        await upgrades.erc1967.getAdminAddress(executorContract.address),
        " getAdminAddress"
    );

    //deploy Dao Governor
    const sbtContract = await get("PondSBT");
    const mainContract = await get("LilyPad");

    const governorFactory: LilyPadGovernor__factory = await ethers.getContractFactory(
        "LilyPadGovernor"
    );
    const governorContract = await upgrades.deployProxy(governorFactory, [
        sbtContract.address,
        executorContract.address,
        2,
        mainContract.address,
        deployer,
    ]);

    await governorContract.deployed();

    console.log(`LilyPad Governor (Proxy) deployed to ${governorContract.address}`);
    console.log(
        await upgrades.erc1967.getImplementationAddress(governorContract.address),
        " getImplementationAddress"
    );
    console.log(
        await upgrades.erc1967.getAdminAddress(governorContract.address),
        " getAdminAddress"
    );

    const executorArtifact = await deployments.getArtifact("LilyPadExecutor");
    const governorArtifact = await deployments.getArtifact("LilyPadGovernor");

    await save("LilyPadExecutor", {
        address: executorContract.address,
        ...executorArtifact,
    });

    await save("LilyPadGovernor", {
        address: governorContract.address,
        ...governorArtifact,
    });
};

export default deployLilyPadDao;

deployLilyPadDao.tags = ["all", "lily-pad-dao"];
