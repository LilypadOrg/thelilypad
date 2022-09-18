import { artifacts, ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat.config";
import { asciiToHex, encode_function_data } from "../scripts/utils";
import {
    LilyPad,
    LilyPadProxyAdmin__factory,
    LilyPadProxy__factory,
    LilyPad__factory,
} from "../typechain-types";
import fs from "fs";
import { ILilyPad } from "../typechain-types/contracts/LilyPad";
import { readSvgContent } from "../scripts/svgUtils";

const BASE_FEE = ethers.utils.parseEther("0.25");

//Portrait Description Common
export function initialLevels(): ILilyPad.LevelStruct[] {
    const { web3 } = require("hardhat");
    const svgContent = fs.readFileSync("images/level0.svg", { encoding: "ascii" });

    return [
        {
            level: 1,
            xpInit: 0,
            xpFin: 999,
            image: web3.utils.fromAscii(readSvgContent("images/level0.svg")),
        },
        {
            level: 2,
            xpInit: 1000,
            xpFin: 1999,
            image: web3.utils.fromAscii(web3.utils.fromAscii(readSvgContent("images/level1.svg"))),
        },
        {
            level: 3,
            xpInit: 2000,
            xpFin: 2999,
            image: web3.utils.fromAscii(web3.utils.fromAscii(readSvgContent("images/level2.svg"))),
        },
        {
            level: 4,
            xpInit: 3000,
            xpFin: 3999,
            image: web3.utils.fromAscii(web3.utils.fromAscii(readSvgContent("images/level3.svg"))),
        },
    ];
}
export function initialEventTypes(): ILilyPad.EventTypeStruct[] {
    const { ethers: Ethers } = require("hardhat");
    return [
        { id: 1, name: asciiToHex("Course") },
        { id: 2, name: asciiToHex("Hackathon") },
        { id: 3, name: asciiToHex("Seminar") },
    ];
}
// Calculated value based on the gas price on the chain
const GAS_PRICE_LINK = 1e9;

const deployLilyPad: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, web3 } = hre;
    const { deploy, log, save } = deployments;

    const { deployer, safeCaller } = await getNamedAccounts();
    const { chainId } = network.config;

    //deploy implementation
    const lilypadFactory: LilyPad__factory = await ethers.getContractFactory("LilyPad");
    var lilypadContract = await lilypadFactory.deploy();
    await lilypadContract.deployed();

    console.log(`LilyPad deployed to ${lilypadContract.address}`);

    //deploy proxy admin
    const proxyAdminFactory: LilyPadProxyAdmin__factory = await ethers.getContractFactory(
        "LilyPadProxyAdmin"
    );
    const lilyPadProxyAdminContract = await proxyAdminFactory.deploy();
    await lilyPadProxyAdminContract.deployed();

    console.log(`LilypadProxyAdmin deployed to ${lilyPadProxyAdminContract.address}`);

    //deploy proxy
    const encoded_initializer = encode_function_data();

    const proxyFactory: LilyPadProxy__factory = await ethers.getContractFactory("LilyPadProxy");
    const lilyPadProxyContract = await proxyFactory.deploy(
        lilypadContract.address,
        lilyPadProxyAdminContract.address,
        encoded_initializer
    );
    await lilyPadProxyContract.deployed();

    console.log(`LilyPadProxy deployed to ${lilyPadProxyContract.address}`);

    //get instance of contract
    lilypadContract = await lilypadFactory.attach(lilyPadProxyContract.address);
    //initialize proxy
    var tx = await lilypadContract.initialize([], await initialEventTypes(), safeCaller);
    const txReceipt = await tx.wait(1);

    for (const lev of initialLevels()) {
        console.log(`uploading lev ${lev.level}`);
        const createLevelTx = await lilypadContract.createLevel([lev]);
        await createLevelTx.wait(1);
    }

    const lilyPadArtifact = await deployments.getArtifact("LilyPad");
    const lilyPadProxyArtifact = await deployments.getArtifact("LilyPadProxy");
    const lilyPadProxyAdminArtifact = await deployments.getArtifact("LilyPadProxyAdmin");

    await save("LilyPad", {
        address: lilypadContract.address,
        ...lilyPadArtifact,
    });

    await save("LilyPadProxy", {
        address: lilyPadProxyContract.address,
        ...lilyPadProxyArtifact,
    });

    await save("LilyPadProxyAdmin", {
        address: lilyPadProxyAdminContract.address,
        ...lilyPadProxyAdminArtifact,
    });
};

export default deployLilyPad;

deployLilyPad.tags = ["all", "lily-pad"];
