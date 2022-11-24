import { ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { networkConfig } from "../helper-hardhat.config";
import { burnAddress, currentNetWork } from "../scripts/utils";
import { LilyPadExecutor__factory, LilyPadGovernor__factory } from "../typechain-types";

const deployLilyPadDao: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, web3 } = hre;
    const { deploy, log, save, get } = deployments;

    const { deployer, safeCaller } = await getNamedAccounts();
    const { chainId } = network.config;

    const minDelay = networkConfig[currentNetWork()].executorMinDelay;
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

    const executorInstance = await executorFactory.attach(executorContract.address);

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

    console.log(`Main Contract: ${mainContract.address}`);

    const governorFactory: LilyPadGovernor__factory = await ethers.getContractFactory(
        "LilyPadGovernor"
    );
    const governorContract = await upgrades.deployProxy(governorFactory, [
        sbtContract.address,
        executorContract.address,
        networkConfig[currentNetWork()].votingDelay,
        networkConfig[currentNetWork()].votingPeriod,
        networkConfig[currentNetWork()].levelThreshold,
        mainContract.address,
        deployer,
    ]);

    await governorContract.deployed();

    const governorInstance = await governorFactory.attach(governorContract.address);

    console.log(`LilyPad Governor (Proxy) deployed to ${governorContract.address}`);
    console.log(
        await upgrades.erc1967.getImplementationAddress(governorContract.address),
        " getImplementationAddress"
    );
    console.log(
        await upgrades.erc1967.getAdminAddress(governorContract.address),
        " getAdminAddress"
    );

    const proposer_role = await executorInstance.PROPOSER_ROLE();
    const executor_role = await executorInstance.EXECUTOR_ROLE();
    const timelock_admin_role = await executorInstance.TIMELOCK_ADMIN_ROLE();
    const canceler_role = await executorInstance.CANCELLER_ROLE();
    await executorInstance.grantRole(proposer_role, governorInstance.address);
    await executorInstance.grantRole(canceler_role, governorInstance.address);
    await executorInstance.grantRole(executor_role, burnAddress);
    const tx = await executorInstance.revokeRole(timelock_admin_role, deployer);
    await tx.wait(1);

    console.log("Guess what? Now you can't do anything!");

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
