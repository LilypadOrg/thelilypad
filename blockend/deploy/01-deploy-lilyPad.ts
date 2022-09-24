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
import { EventStruct } from "../types/EventStruct";
import { BigNumber } from "ethers";
import Web3 from "web3";

const BASE_FEE = ethers.utils.parseEther("0.25");

//Portrait Description Common
export function initialLevels(): ILilyPad.LevelStruct[] {
    const { web3 } = require("hardhat");

    return [
        {
            level: 1,
            xpInit: 0,
            xpFin: 999,
            image: web3.utils.fromAscii(
                "bafkreid5wecvxn5mecr7y4yd5ln5txecssta3rbu3nmrinyt2a7i7bivcu"
            ),
        },
        {
            level: 2,
            xpInit: 1000,
            xpFin: 1999,
            image: web3.utils.fromAscii(
                "bafybeigeorcqattgtnhpodx5qizim6uibrer3qincicxr2zaktmomzsjqa"
            ),
        },
        {
            level: 3,
            xpInit: 2000,
            xpFin: 2999,
            image: web3.utils.fromAscii(
                "bafybeihwzknzd6x3jhg7wevpiummrpr3jbs5ompja337eskrfm2jyxxece"
            ),
        },
        {
            level: 4,
            xpInit: 3000,
            xpFin: 3999,
            image: web3.utils.fromAscii(
                "bafkreib2jrno7jqqgipb7ezlqbleoygxiklehytanklhaq4o5twyx5qbca"
            ),
        },
    ];
}

export function initialEventTypes(): ILilyPad.EventTypeStruct[] {
    const { ethers: Ethers, web3 } = require("hardhat");
    return [
        { id: 1, name: web3.utils.fromAscii("Course") },
        { id: 2, name: web3.utils.fromAscii("Hackathon") },
        { id: 3, name: web3.utils.fromAscii("Seminar") },
    ];
}

export function initialCourses(): EventStruct[] {
    const { web3 } = require("hardhat");
    let events: EventStruct[] = [];

    return [
        {
            id: BigNumber.from(10001),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii(
                "Learn Blockchain, Solidity, and Full Stack Web3 Development with JavaScript"
            ),
            xp: BigNumber.from(1000),
            accolades: [
                {
                    eventId: 10001,
                    title: web3.utils.fromAscii("Beginner"),
                    badge: web3.utils.fromAscii(
                        "bafkreigocoayclhjm6yrtjp6kcczhsmkam6vh4reyy6w6fccvh6lc6encq"
                    ),
                },
                {
                    eventId: 10001,
                    title: web3.utils.fromAscii("Intermediate"),
                    badge: web3.utils.fromAscii(
                        "bafkreiazbvvnpfoqei7jmnrv7slfnfwyfxnu32lr3xomczngz35y2vwrue"
                    ),
                },
            ],
        },
        {
            id: BigNumber.from(10002),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Learn Web3 Dao - Freshman Track"),
            xp: BigNumber.from(500),
            accolades: [
                {
                    eventId: 10002,
                    title: web3.utils.fromAscii("Beginner"),
                    badge: web3.utils.fromAscii(
                        "bafkreigocoayclhjm6yrtjp6kcczhsmkam6vh4reyy6w6fccvh6lc6encq"
                    ),
                },
            ],
        },
        {
            id: BigNumber.from(10003),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("CryptoZombies"),
            xp: BigNumber.from(1000),
            accolades: [
                {
                    eventId: 10003,
                    title: web3.utils.fromAscii("Beginner"),
                    badge: web3.utils.fromAscii(
                        "bafkreigocoayclhjm6yrtjp6kcczhsmkam6vh4reyy6w6fccvh6lc6encq"
                    ),
                },
            ],
        },
        {
            id: BigNumber.from(10004),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("SpeedRunEthereum - Challenge 0: Simple NFT Example"),
            xp: BigNumber.from(250),
            accolades: [
                {
                    eventId: 10004,
                    title: web3.utils.fromAscii("Intermediate"),
                    badge: web3.utils.fromAscii(
                        "bafkreiazbvvnpfoqei7jmnrv7slfnfwyfxnu32lr3xomczngz35y2vwrue"
                    ),
                },
            ],
        },
        {
            id: BigNumber.from(10005),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii(
                "SpeedRunEthereum - Challenge 1: Decentralized Staking App"
            ),
            xp: BigNumber.from(250),
            accolades: [
                {
                    eventId: 10005,
                    title: web3.utils.fromAscii("Intermediate"),
                    badge: web3.utils.fromAscii(
                        "bafkreiazbvvnpfoqei7jmnrv7slfnfwyfxnu32lr3xomczngz35y2vwrue"
                    ),
                },
            ],
        },
        {
            id: BigNumber.from(10006),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("SpeedRunEthereum - Challenge 2: Token Vendor"),
            xp: BigNumber.from(250),
            accolades: [
                {
                    eventId: 10006,
                    title: web3.utils.fromAscii("Intermediate"),
                    badge: web3.utils.fromAscii(
                        "bafkreiazbvvnpfoqei7jmnrv7slfnfwyfxnu32lr3xomczngz35y2vwrue"
                    ),
                },
            ],
        },
        {
            id: BigNumber.from(10007),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Advanced Computer Vision"),
            xp: BigNumber.from(500),
            accolades: [
                {
                    eventId: 10007,
                    title: web3.utils.fromAscii("Advanced"),
                    badge: web3.utils.fromAscii(
                        "bafkreibvowxntrika5e5jlrfeujlrpqbgnydk7prxxlbpcxfinlbgqfv4q"
                    ),
                },
            ],
        },
        {
            id: BigNumber.from(10008),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Advanced Git"),
            xp: BigNumber.from(500),
            accolades: [
                {
                    eventId: 10008,
                    title: web3.utils.fromAscii("Advanced"),
                    badge: web3.utils.fromAscii(
                        "bafkreibvowxntrika5e5jlrfeujlrpqbgnydk7prxxlbpcxfinlbgqfv4q"
                    ),
                },
            ],
        },
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
        console.log(`uploading level ${lev.level}`);
        const createLevelTx = await lilypadContract.createLevel([lev]);
        await createLevelTx.wait(1);
    }

    for (const course of initialCourses()) {
        var flattenedArray = course.accolades.map((i: ILilyPad.AccoladeStruct) => {
            return (
                i.eventId.toString() +
                web3.utils.toAscii(i.title.toString()) +
                web3.utils.toAscii(i.badge.toString())
            );
        });

        const hash = (web3 as Web3).utils.soliditySha3(
            { t: "uint256", v: Number(course.id) },
            { t: "uint256", v: Number(course.eventTypeId) },
            { t: "bytes", v: course.eventName.toString() },
            { t: "uint256", v: Number(course.xp) },
            {
                t: "string",
                v: flattenedArray.join(""),
            }
        );

        const signedData = await web3.eth.sign(hash!, safeCaller);

        console.log(`uploading course ${course.id}`);

        const createCourseTx = await lilypadContract.submitEvent(
            course.id,
            course.eventTypeId,
            course.eventName,
            course.xp,
            course.accolades,
            signedData
        );
        await createCourseTx.wait(1);
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
