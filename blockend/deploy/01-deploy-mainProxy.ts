import { artifacts, ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat.config";

const BASE_FEE = ethers.utils.parseEther("0.25");

// Calculated value based on the gas price on the chain
const GAS_PRICE_LINK = 1e9;

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log, save } = deployments;

    const { deployer } = await getNamedAccounts();
    const { chainId } = network.config;

    const Main = await ethers.getContractFactory("Main");
    const main = await upgrades.deployProxy(Main);
    await main.deployed();

    console.log(main.address, " Main(proxy) address");
    console.log(
        await upgrades.erc1967.getImplementationAddress(main.address),
        " getImplementationAddress"
    );
    console.log(await upgrades.erc1967.getAdminAddress(main.address), " getAdminAddress");

    const artifact = await deployments.getArtifact("Main");

    await save("Main", {
        address: main.address,
        ...artifact,
    });
};

export default deployMocks;

deployMocks.tags = ["all", "proxy"];
