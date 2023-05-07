import { ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { encode_function_data } from "../scripts/utils";
import {
    LilyPad,
    LilyPadProxyAdmin__factory,
    LilyPadProxy__factory,
    LilyPad__factory,
} from "../typechain-types";
import { ILilyPad } from "../typechain-types/contracts/LilyPad";
import { EventStruct } from "../types/EventStruct";
import { BigNumber, BigNumberish } from "ethers";
import Web3 from "web3";

const BASE_FEE = ethers.utils.parseEther("0.25");

//Portrait Description Common
export function initialLevels(): ILilyPad.LevelStruct[] {
    const { web3 } = require("hardhat");

    return [
        {
            level: 1,
            xpInit: 0,
            xpFin: 500,
            image: web3.utils.fromAscii(
                "bafybeig4bsle3vn6wbzkami5mqfpbfridr373k76afzzolmjyvtengemh4"
            ),
        },
        {
            level: 2,
            xpInit: 501,
            xpFin: 1300,
            image: web3.utils.fromAscii(
                "bafybeick5ny2fakshlw5oht62qpg4rg7twiuqxckjvszdeczc6mdizqv4i"
            ),
        },
        {
            level: 3,
            xpInit: 1301,
            xpFin: 2300,
            image: web3.utils.fromAscii(
                "bafybeifnquuxfuvsj7fwcw7yeawgrglfpi4isdol3cr3bffinjjcsilj3y"
            ),
        },
        {
            level: 4,
            xpInit: 2301,
            xpFin: 3600,
            image: web3.utils.fromAscii(
                "bafybeigwodh2awyhj2y3ifbagbthkuam5sapaywcict6bphr5n2i5rwgcu"
            ),
        },
        {
            level: 5,
            xpInit: 3601,
            xpFin: 5100,
            image: web3.utils.fromAscii(
                "bafybeicy3p2zewqcbohasrm2n44valvns5xsregfmxm5fsz5mmbb4xmoc4"
            ),
        },
        {
            level: 6,
            xpInit: 5101,
            xpFin: 7000,
            image: web3.utils.fromAscii(
                "bafybeicex57ugualsn7ibfxpkwpkvrzqaqaqsie6hwvnqhc5427o2fcg44"
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

export function initialTechnologies(): ILilyPad.TechnologyStruct[] {
    const { web3 } = require("hardhat");

    return [
        {
            techId: 1,
            techName: web3.utils.fromAscii("HTML"),
        },
        {
            techId: 2,
            techName: web3.utils.fromAscii("CSS"),
        },
        {
            techId: 3,
            techName: web3.utils.fromAscii("JavaScript"),
        },
        {
            techId: 4,
            techName: web3.utils.fromAscii("TypeScript"),
        },
        {
            techId: 5,
            techName: web3.utils.fromAscii("React"),
        },
        {
            techId: 6,
            techName: web3.utils.fromAscii("Next JS"),
        },
        {
            techId: 7,
            techName: web3.utils.fromAscii("Solidity"),
        },
        {
            techId: 8,
            techName: web3.utils.fromAscii("Hardhat"),
        },
        {
            techId: 9,
            techName: web3.utils.fromAscii("ChainLink"),
        },
        {
            techId: 10,
            techName: web3.utils.fromAscii("TheGraph"),
        },
        {
            techId: 11,
            techName: web3.utils.fromAscii("Moralis"),
        },
        {
            techId: 12,
            techName: web3.utils.fromAscii("IPFS"),
        },
        {
            techId: 13,
            techName: web3.utils.fromAscii("Scaffold-Eth"),
        },
        {
            techId: 14,
            techName: web3.utils.fromAscii("Node JS"),
        },
        {
            techId: 15,
            techName: web3.utils.fromAscii("OpenCV"),
        },
        {
            techId: 16,
            techName: web3.utils.fromAscii("Mediapipe"),
        },
        {
            techId: 17,
            techName: web3.utils.fromAscii("Python"),
        },
        {
            techId: 18,
            techName: web3.utils.fromAscii("Git"),
        },
        {
            techId: 19,
            techName: web3.utils.fromAscii("Command Line"),
        },
        {
            techId: 20,
            techName: web3.utils.fromAscii("Alchemy"),
        },
        {
            techId: 21,
            techName: web3.utils.fromAscii("Ethers JS"),
        },
        {
            techId: 22,
            techName: web3.utils.fromAscii("The Graph"),
        },
        {
            techId: 23,
            techName: web3.utils.fromAscii("Alchemy-SDK"),
        },
        {
            techId: 24,
            techName: web3.utils.fromAscii("Axios"),
        },
        {
            techId: 25,
            techName: web3.utils.fromAscii("React-Bootstrap"),
        },
        {
            techId: 26,
            techName: web3.utils.fromAscii("Tailwind CSS"),
        },
        {
            techId: 27,
            techName: web3.utils.fromAscii("Blockchain"),
        },
        {
            techId: 28,
            techName: web3.utils.fromAscii("Cryptography"),
        },
        {
            techId: 29,
            techName: web3.utils.fromAscii("SHA256"),
        },
        {
            techId: 30,
            techName: web3.utils.fromAscii("Ethereum"),
        },
        {
            techId: 31,
            techName: web3.utils.fromAscii("Bitcoin"),
        },
    ];
}

export function initialTechBadges(): ILilyPad.TechBadgeStruct[] {
    const { web3 } = require("hardhat");

    return [
        {
            techId: 3,
            level: 1,
            badge: web3.utils.fromAscii(
                "bafkreicfez4ls7m52skiompb2xmvkfrk5cwdxnhk42wahxp5wggdz5t67m"
            ),
        },
        {
            techId: 3,
            level: 2,
            badge: web3.utils.fromAscii(
                "bafybeic3csythornu6umkexdnxzv2vx7nxmvc24uz3fcx7x5pm5w2gmski"
            ),
        },
        {
            techId: 3,
            level: 3,
            badge: web3.utils.fromAscii(
                "bafybeidj5ljt5entkpybwucq6pulxzkdkmsybaggstfp5yumvap4g6kjl4"
            ),
        },
        {
            techId: 7,
            level: 1,
            badge: web3.utils.fromAscii(
                "bafybeifaarnxionjg2hawnksg4djx6imlxqyynr7fmmylqe72xpcjpvagm"
            ),
        },
        {
            techId: 7,
            level: 2,
            badge: web3.utils.fromAscii(
                "bafybeidjkhkmkr6vwy4shgdojqngyytxzimstyfcmni5zp5fidukpucmam"
            ),
        },
        {
            techId: 7,
            level: 3,
            badge: web3.utils.fromAscii(
                "bafybeifz5bcgdl3tp6ols5ydojrs6si7mtoamd2juszj5gbsj2u3i4kzgm"
            ),
        },
        {
            techId: 9,
            level: 1,
            badge: web3.utils.fromAscii(
                "bafybeib6xo45wyajbro4ddxavh6kao5rxskad2r6dzw7gc4ikyvhsovnl4"
            ),
        },
        {
            techId: 9,
            level: 2,
            badge: web3.utils.fromAscii(
                "bafybeibvcgfold7gpj2jai4z2yegeu5b444q2teozh2gjz7gbkqp4sr2fm"
            ),
        },
        {
            techId: 9,
            level: 3,
            badge: web3.utils.fromAscii(
                "bafybeif3caqfxkll5g6n3d4ffos2qsdn24yhlsf5demj5y7afseeesv6qi"
            ),
        },
        {
            techId: 8,
            level: 1,
            badge: web3.utils.fromAscii(
                "bafybeiad2jihksbugyzqltnekdt2c5bdq2jjwnuc2thdmmxor7qmz6uioe"
            ),
        },
        {
            techId: 8,
            level: 2,
            badge: web3.utils.fromAscii(
                "bafybeih2oayq3usx56xpxjdqd4odnzoybq7u5x7nbjcznlaryedfhswdci"
            ),
        },
        {
            techId: 8,
            level: 3,
            badge: web3.utils.fromAscii(
                "bafybeidm2cnyplizm7hnrawbuphefiysmznzukae7oxrpzxqfoovc6kqgm"
            ),
        },
        {
            techId: 14,
            level: 1,
            badge: web3.utils.fromAscii(
                "bafybeiedix5kd6une344t35s42tq65xpo2uzk6m65lavuz4rm4lmb3uc5m"
            ),
        },
        {
            techId: 14,
            level: 2,
            badge: web3.utils.fromAscii(
                "bafybeifhcubf7uxw2c62cyh2j3wnfabtrlzeyhnvpzl2vw4qdyw2vg76ba"
            ),
        },
        {
            techId: 14,
            level: 3,
            badge: web3.utils.fromAscii(
                "bafybeiazhst5l4vkhzqgnojxmtken57polvj35c4sll4rmkc625tzuf5wm"
            ),
        },
        {
            techId: 26,
            level: 1,
            badge: web3.utils.fromAscii(
                "bafybeifihfwyitpn3h7q2bk4klas5wgytgmziy4syv4vtogmaqhik6o7zi"
            ),
        },
        {
            techId: 26,
            level: 2,
            badge: web3.utils.fromAscii(
                "bafybeibrimsihsguahni6o7gmcubvhwnd3qxkpenug3ncqyukhhjxg4vrq"
            ),
        },
        {
            techId: 26,
            level: 3,
            badge: web3.utils.fromAscii(
                "bafybeiadwovtqxbhecoac6xfzelv7b53b5re4d6kvn236v6c7ozrootaby"
            ),
        },
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
            level: 2,
            xp: BigNumber.from(1000),
            technologies: [7, 8, 9],
            /*accolades: [
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
            ],*/
        },
        {
            id: BigNumber.from(10002),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Learn Web3 Dao - Freshman Track"),
            level: 1,
            xp: BigNumber.from(500),
            technologies: [3, 7],
            /*accolades: [
                {
                    eventId: 10002,
                    title: web3.utils.fromAscii("Beginner"),
                    badge: web3.utils.fromAscii(
                        "bafkreigocoayclhjm6yrtjp6kcczhsmkam6vh4reyy6w6fccvh6lc6encq"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10003),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("CryptoZombies"),
            level: 1,
            xp: BigNumber.from(1000),
            technologies: [7],
            /*accolades: [
                {
                    eventId: 10003,
                    title: web3.utils.fromAscii("Beginner"),
                    badge: web3.utils.fromAscii(
                        "bafkreigocoayclhjm6yrtjp6kcczhsmkam6vh4reyy6w6fccvh6lc6encq"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10004),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("SpeedRunEthereum - Challenge 0: Simple NFT Example"),
            level: 2,
            xp: BigNumber.from(250),
            technologies: [3, 4, 5, 7, 8, 13, 14],
            /*accolades: [
                {
                    eventId: 10004,
                    title: web3.utils.fromAscii("Intermediate"),
                    badge: web3.utils.fromAscii(
                        "bafkreiazbvvnpfoqei7jmnrv7slfnfwyfxnu32lr3xomczngz35y2vwrue"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10005),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii(
                "SpeedRunEthereum - Challenge 1: Decentralized Staking App"
            ),
            level: 2,
            xp: BigNumber.from(250),
            technologies: [3, 4, 5, 7, 8, 13, 14],
            /*accolades: [
                {
                    eventId: 10005,
                    title: web3.utils.fromAscii("Intermediate"),
                    badge: web3.utils.fromAscii(
                        "bafkreiazbvvnpfoqei7jmnrv7slfnfwyfxnu32lr3xomczngz35y2vwrue"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10006),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("SpeedRunEthereum - Challenge 2: Token Vendor"),
            level: 2,
            xp: BigNumber.from(250),
            technologies: [3, 4, 5, 7, 8, 13, 14],
            /*accolades: [
                {
                    eventId: 10006,
                    title: web3.utils.fromAscii("Intermediate"),
                    badge: web3.utils.fromAscii(
                        "bafkreiazbvvnpfoqei7jmnrv7slfnfwyfxnu32lr3xomczngz35y2vwrue"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10007),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Advanced Computer Vision"),
            level: 3,
            xp: BigNumber.from(500),
            technologies: [15, 16, 17],
            /*accolades: [
                {
                    eventId: 10007,
                    title: web3.utils.fromAscii("Advanced"),
                    badge: web3.utils.fromAscii(
                        "bafkreibvowxntrika5e5jlrfeujlrpqbgnydk7prxxlbpcxfinlbgqfv4q"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10008),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Advanced Git"),
            level: 3,
            xp: BigNumber.from(500),
            technologies: [18, 19],
            /*accolades: [
                {
                    eventId: 10008,
                    title: web3.utils.fromAscii("Advanced"),
                    badge: web3.utils.fromAscii(
                        "bafkreibvowxntrika5e5jlrfeujlrpqbgnydk7prxxlbpcxfinlbgqfv4q"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10009),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Portfolio Website"),
            level: 1,
            xp: BigNumber.from(500),
            technologies: [6, 26],
            /*accolades: [
                {
                    eventId: 10009,
                    title: web3.utils.fromAscii("Advanced"),
                    badge: web3.utils.fromAscii(
                        "bafkreibvowxntrika5e5jlrfeujlrpqbgnydk7prxxlbpcxfinlbgqfv4q"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10010),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Git and GitHub for Beginners - Crash Course"),
            level: 1,
            xp: BigNumber.from(250),
            technologies: [18, 19],
            /*accolades: [
                {
                    eventId: 10010,
                    title: web3.utils.fromAscii("Advanced"),
                    badge: web3.utils.fromAscii(
                        "bafkreibvowxntrika5e5jlrfeujlrpqbgnydk7prxxlbpcxfinlbgqfv4q"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10011),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Deep Reinforcement Learning in Python Tutorial"),
            level: 3,
            xp: BigNumber.from(800),
            technologies: [17],
            /*accolades: [
                {
                    eventId: 10011,
                    title: web3.utils.fromAscii("Advanced"),
                    badge: web3.utils.fromAscii(
                        "bafkreibvowxntrika5e5jlrfeujlrpqbgnydk7prxxlbpcxfinlbgqfv4q"
                    ),
                },
            ],*/
        },
        {
            id: BigNumber.from(10012),
            eventTypeId: BigNumber.from(1),
            eventName: web3.utils.fromAscii("Python Object Oriented Programming (OOP)"),
            level: 1,
            xp: BigNumber.from(250),
            technologies: [17],
            /*accolades: [
                {
                    eventId: 10012,
                    title: web3.utils.fromAscii("Advanced"),
                    badge: web3.utils.fromAscii(
                        "bafkreibvowxntrika5e5jlrfeujlrpqbgnydk7prxxlbpcxfinlbgqfv4q"
                    ),
                },
            ],*/
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
    var tx = await lilypadContract.initialize(
        [],
        await initialEventTypes(),
        await initialTechnologies(),
        deployer
    );
    const txReceipt = await tx.wait(1);

    for (const lev of initialLevels()) {
        console.log(`uploading level ${lev.level}`);
        const createLevelTx = await lilypadContract.createLevel([lev]);
        await createLevelTx.wait(1);
    }

    for (const course of initialCourses()) {
        //var flattenedArray = course.accolades.map((i: ILilyPad.AccoladeStruct) => {
        //    return (
        //        i.eventId.toString() +
        //        web3.utils.toAscii(i.title.toString()) +
        //        web3.utils.toAscii(i.badge.toString())
        //    );
        //});
        let lista: number[] = [];
        course.technologies.forEach((e) => {
            let number = Number(e);
            lista.push(number);
        });

        const hash = (web3 as Web3).utils.soliditySha3(
            { t: "uint256", v: Number(course.id) },
            { t: "uint256", v: Number(course.eventTypeId) },
            { t: "bytes", v: course.eventName.toString() },
            { t: "uint256", v: Number(course.xp) },
            { t: "uint256", v: Number(course.level) },
            ...lista
            //{
            //    t: "string",
            //    v: flattenedArray.join(""),
            //}
        );

        const signedData = await web3.eth.sign(hash!, deployer);

        console.log(`uploading course ${course.id}`);

        const createCourseTx = await lilypadContract.submitEvent(
            course.id,
            course.eventTypeId,
            course.eventName,
            course.xp,
            course.level,
            course.technologies,
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
