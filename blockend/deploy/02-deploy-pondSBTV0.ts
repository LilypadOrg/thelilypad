import { artifacts, ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { developmentChains, networkConfig } from "../helper-hardhat.config";
import { verify } from "../utils/verify";

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy, log, get } = deployments;

    const { deployer } = await getNamedAccounts();
    const { chainId } = network.config;

    const main = await get("Main");

    console.log(main.address, " Main(proxy) address");

    const mintFee = ethers.utils.parseEther("0.1");
    const levelSVGs = [
        fs.readFileSync("images/level0.svg", { encoding: "utf8" }),
        fs.readFileSync("images/level1.svg", { encoding: "utf8" }),
    ];
    const args = [mintFee, levelSVGs, main.address];

    log("Deploying PondSBTV0...");
    log("----------------------------------------");

    const pondToken = await deploy("PondSBTV0", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[chainId!].blockConfirmations! | 1,
    });
    log("Deployed!");
    log("----------------------------------------");

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying ...");
        log("----------------------------------------");
        await verify(pondToken.address, args);
        log("Verified!");
        log("----------------------------------------");
    }
};

export default deployMocks;

deployMocks.tags = ["all", "pondSBTV0"];
