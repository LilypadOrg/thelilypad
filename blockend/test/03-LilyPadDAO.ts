import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import deployLilyPad from "../deploy/01-deploy-lilyPad";
import deployLilyPadDao from "../deploy/03-deploy-lilyPadDao";
import deployLilyPadTreasure from "../deploy/04-deploy-lilyPadTreasure";
import {
    ILilyPad,
    LilyPad,
    LilyPadGovernor,
    LilyPadGovernor__factory,
    LilyPadTreasure,
    LilyPadTreasure__factory,
    LilyPad__factory,
    PondSBT,
    PondSBT__factory,
} from "../typechain-types";
import Web3 from "web3";
import { EventSubmitedEventObject } from "../typechain-types/contracts/LilyPad";
import deployPondSBT from "../deploy/02-deploy-pondSBT";
import { MemberStruct } from "../types/contractTypes";
import { LilyPadExecutor } from "../typechain-types/contracts/Governance/LilyPadExecutor";
import { LilyPadExecutor__factory } from "../typechain-types/factories/contracts/Governance/index";
import { chainMine, chainSleep, currentNetWork, getAccount } from "../scripts/utils";
import { executeDaoProcess } from "../scripts/daoUtils";
import { networkConfig } from "../helper-hardhat.config";
import { network } from "hardhat";

const hre = require("hardhat");
/*describe("LilyPadDAO", function () {
    const { deployments, getNamedAccounts, web3, ethers } = require("hardhat");
    const { get } = deployments;
    const BASE_FEE = ethers.utils.parseEther("0.25");

    let _lilyPadContract: LilyPad;
    let _pondSBTContract: PondSBT;
    let _lilyPadTreasureContract: LilyPadTreasure;
    let _lilyPadGovernorContract: LilyPadGovernor;
    let _lilyPadExecutorContract: LilyPadExecutor;

    let _souls: any[] = [];
    let _members: MemberStruct[] = [];
    beforeEach(async function () {
        const { deployer } = await getNamedAccounts();
        const safeCaller = deployer;

        const accounts: any[] = await ethers.getSigners();
        const user = accounts[1];

        await deployLilyPad(hre);
        await deployPondSBT(hre);
        await deployLilyPadDao(hre);
        await deployLilyPadTreasure(hre);

        const lilypadFactory: LilyPad__factory = await ethers.getContractFactory("LilyPad");
        const _lilyPadProxyContract = await get("LilyPadProxy");

        _lilyPadContract = await get("LilyPad");
        _lilyPadContract = await lilypadFactory.attach(_lilyPadProxyContract.address);

        const pondSBTFactory: PondSBT__factory = await ethers.getContractFactory("PondSBT");
        const _pondSbtProxyContract = await get("PondSBTProxy");

        _pondSBTContract = await pondSBTFactory.attach(_pondSbtProxyContract.address);

        const _lilyPadTreasureFactory: LilyPadTreasure__factory = await ethers.getContractFactory(
            "LilyPadTreasure"
        );
        const _lilyPadTreasure = await get("LilyPadTreasure");
        _lilyPadTreasureContract = await _lilyPadTreasureFactory.attach(_lilyPadTreasure.address);

        const _lilyPadGovernorFactory: LilyPadGovernor__factory = await ethers.getContractFactory(
            "LilyPadGovernor"
        );
        _lilyPadGovernorContract = await get("LilyPadGovernor");
        _lilyPadGovernorContract = await _lilyPadGovernorFactory.attach(
            _lilyPadGovernorContract.address
        );

        const _lilyPadExecutorFactory: LilyPadExecutor__factory = await ethers.getContractFactory(
            "LilyPadExecutor"
        );
        _lilyPadExecutorContract = await get("LilyPadExecutor");
        _lilyPadExecutorContract = await _lilyPadExecutorFactory.attach(
            _lilyPadExecutorContract.address
        );

        assert(_lilyPadContract, "Could not deploy lilyPad");
        assert(_pondSBTContract, "Could not deploy PondSBT");
        assert(_lilyPadTreasureContract, "Could not deploy Treasure");
        assert(_lilyPadExecutorContract, "Could not deploy Executor");
        assert(_lilyPadGovernorContract, "Could not deploy DAO");

        //create courses
        const _web3: Web3 = web3;

        var courseArray: ILilyPad.AccoladeStruct[] = [];

        courseArray.push(
            {
                eventId: 0,
                title: web3.utils.fromAscii("BEGINER"),
                badge: web3.utils.fromAscii("BEGINER BADGE SVG"),
            },
            {
                eventId: 0,
                title: web3.utils.fromAscii("ADVANCED"),
                badge: web3.utils.fromAscii("ADVANCED BADGE SVG"),
            }
        );

        var flattenedArray = courseArray.map((i) => {
            return i.eventId.toString() + web3.utils.toAscii(i.title) + web3.utils.toAscii(i.badge);
        });

        let hash = _web3.utils.soliditySha3(
            { t: "uint256", v: 1 },
            { t: "uint256", v: 1 },
            { t: "bytes", v: web3.utils.fromAscii("Basic Solidity Course") },
            { t: "uint256", v: 10 },
            {
                t: "string",
                v: flattenedArray.join(""),
            }
        );

        console.log("Signing course data...");
        let signedData = await _web3.eth.sign(hash!, safeCaller);
        console.log(`Course Data Signed: ${signedData}`);
        const courseTx = await _lilyPadContract.submitEvent(
            1,
            1,
            web3.utils.fromAscii("Basic Solidity Course"),
            10,
            courseArray,
            signedData
        );

        const submitCourseReceipt = await courseTx.wait(1);
        var eventId = 0;
        for (const ev of submitCourseReceipt.events!) {
            if (ev.event == "EventSubmited") {
                eventId = ev.args!.eventId;
            }
        }
        assert(eventId == 1, "Event not Submited!");

        //create souls
        _souls = await getAccount("souls", 10);

        for (let idx = 0; idx < _souls.length; idx++) {
            const name: string = `Soul_${idx.toString()}`;
            const initialXp: number = 1000;
            var completedCourses: number[] = [];

            var badges: any[] = []; //badges is just an accolade array
            var flattenedBadgesArray = badges.map((i) => {
                return (
                    i[0].toString() +
                    web3.utils.toAscii(i[1].toString()) +
                    web3.utils.toAscii(i[2].toString())
                );
            });

            //generates sig data
            console.log("Signing member data...");
            hash = _web3.utils.soliditySha3({ t: "uint256", v: initialXp }, ...completedCourses, {
                t: "string",
                v: flattenedBadgesArray.join(""),
            });

            signedData = await _web3.eth.sign(hash!, safeCaller);

            console.log(`Member Data Signed: ${signedData}`);

            const memberTx = await _lilyPadContract
                .connect(_souls[idx])
                .createMember(initialXp, completedCourses, badges, signedData);

            await memberTx.wait(1);

            const memberValues = await _lilyPadContract.getMember(_souls[idx].address);

            //mint SBT
            const mintTx = await _lilyPadContract.mintTokenForMember(_souls[idx].address, {
                value: BASE_FEE,
            });
            await mintTx.wait(1);

            _members.push({
                pathChosen: memberValues.pathChosen,
                xp: memberValues.xp,
                level: memberValues.level,
                DAO: memberValues.DAO,
                tokenId: memberValues.tokenId,
                completedEvents: memberValues.completedEvents,
                badges: memberValues.badges,
            });
        }
    });
    describe("DaoTest", function () {
        it("DaoTest::01::Try to create a proposal and vote. It should work with no problems", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();

            console.log(
                `************************************** Propose and Voting ******************************************`
            );

            //proposal description can be plain text or a ipfs hash with the description
            //i recommend the ipfs hash. this way the proposals can be well descripted without make unviable to propose
            const PROPOSAL_DESCRIPTION =
                "bafkreicwrdofqb56rkspleeo3deyxpl4ku23bncxrsozfh6mr7pgsmjkge";
            const args = [4];

            const factory = await ethers.getContractFactory("LilyPadGovernor");
            const PROPOSAL_FUNCTION = factory.interface.encodeFunctionData(
                "setLevelThreshold",
                args
            );

            await chainMine(2);

            //total voting supply
            console.log(`Total voting suply: ${await _pondSBTContract.totalSupply()}`);

            //check if proposalThreshold was changed
            console.log(`Old level Threshold: ${await _lilyPadGovernorContract.levelThreshold()}`);

            await executeDaoProcess(
                [_lilyPadGovernorContract.address],
                [0],
                [PROPOSAL_FUNCTION],
                PROPOSAL_DESCRIPTION,
                _souls[0],
                _souls,
                1,
                _lilyPadGovernorContract,
                networkConfig[currentNetWork()].votingDelay,
                networkConfig[currentNetWork()].votingPeriod,
                networkConfig[currentNetWork()].executorMinDelay
            );

            //check if proposalThreshold was changed
            console.log(`New level Threshold: ${await _lilyPadGovernorContract.levelThreshold()}`);

            assert(
                (await _lilyPadGovernorContract.levelThreshold()).eq(4),
                "Proposal not executed correctly :-("
            );
        });
        it("DaoTest::02::Try to create a proposal and vote, but not reaching quorum. It should revert when trying to queue proposal", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();

            const executorMinDelay = networkConfig[currentNetWork()].executorMinDelay;
            const quorum = 25; //percentage
            const votingPeriod = networkConfig[currentNetWork()].votingDelay;
            const votingDelay = networkConfig[currentNetWork()].votingDelay;

            console.log(
                `************************************** Propose and Voting ******************************************`
            );

            //proposal
            const PROPOSAL_DESCRIPTION =
                "bafkreicwrdofqb56rkspleeo3deyxpl4ku23bncxrsozfh6mr7pgsmjkge";
            const args = [4];

            const factory = await ethers.getContractFactory("LilyPadGovernor");
            const PROPOSAL_FUNCTION = factory.interface.encodeFunctionData(
                "setLevelThreshold",
                args
            );

            await executeDaoProcess(
                [_lilyPadGovernorContract.address],
                [0],
                [PROPOSAL_FUNCTION],
                PROPOSAL_DESCRIPTION,
                _souls[0],
                _souls.slice(0, 2),
                1,
                _lilyPadGovernorContract,
                votingDelay,
                votingPeriod,
                executorMinDelay
            );

            await chainSleep(executorMinDelay + 1);
            await chainMine(1);

            //check if proposalThreshold was changed
            console.log(`New level Threshold: ${await _lilyPadGovernorContract.levelThreshold()}`);

            assert(
                (await _lilyPadGovernorContract.levelThreshold()).eq(1),
                "Proposal executed without quorum :-("
            );
        });
    });
    describe("TreasureTest", function () {
        it("TreasureTest::01::Try to create mint a token and check if the treasure grows. It should work with no problems", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
            const _web3: Web3 = web3;
            console.log(
                `************************************** Mint Token **************************************************`
            );
            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];

            const initialTreasureBalance = await _lilyPadTreasureContract.daoTreasure();
            console.log(
                `Treasure balance before new mint: ${await web3.utils.fromWei(
                    initialTreasureBalance.toString(),
                    "ether"
                )} eth!`
            );

            const mintTx = await _lilyPadContract.mintTokenForMember(user.address, {
                value: BASE_FEE,
            });
            await mintTx.wait(1);

            const memberValues = await _lilyPadContract.getMember(user.address);

            assert(memberValues.tokenId.gt(0), "Token not minted correctly :-(");

            console.log(`Member ${user.address} minted token ${memberValues.tokenId}`);

            console.log(
                `************************************** Checking Treasure after mint ********************************`
            );

            const treasureBalance = await _lilyPadTreasureContract.daoTreasure();

            assert(
                treasureBalance.gt(0) && treasureBalance.gt(initialTreasureBalance),
                "Treasure did not received fees :-("
            );

            console.log(
                `Treasure now owns ${await web3.utils.fromWei(
                    treasureBalance.toString(),
                    "ether"
                )} eth!`
            );
        });
        it("TreasureTest::02::Try to propose funds request, approve and execute. It should work with no problems", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
            const _web3: Web3 = web3;

            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];

            const initialTreasureBalance = await _lilyPadTreasureContract.daoTreasure();

            console.log(
                `************************************** Checking Treasure ********************************`
            );

            const treasureBalance = await _lilyPadTreasureContract.daoTreasure();

            assert(treasureBalance.gt(0), "Treasure did not received fees :-(");

            console.log(
                `Treasure owns ${await web3.utils.fromWei(
                    treasureBalance.toString(),
                    "ether"
                )} eth!`
            );

            console.log(
                `************************************** Propose and Voting ******************************************`
            );

            //proposal description can be plain text or a ipfs hash with the description
            //i recommend the ipfs hash. this way the proposals can be well descripted without make unviable to propose
            const PROPOSAL_DESCRIPTION =
                "bafkreicwrdofqb56rkspleeo3deyxpl4ku23bncxrsozfh6mr7pgsmjkge";
            const args = [BASE_FEE, user.address];

            const factory = await ethers.getContractFactory("LilyPadTreasure");
            const PROPOSAL_FUNCTION = factory.interface.encodeFunctionData(
                "withdrawFromTreasure",
                args
            );

            await chainMine(2);

            //total voting supply
            console.log(`Total voting suply: ${await _pondSBTContract.totalSupply()}`);

            //check requester initial balance
            const initialBalance = await _web3.eth.getBalance(user.address);
            console.log(
                `Requester Initial Balance: ${_web3.utils.fromWei(initialBalance, "ether")}`
            );

            await executeDaoProcess(
                [_lilyPadTreasureContract.address],
                [0],
                [PROPOSAL_FUNCTION],
                PROPOSAL_DESCRIPTION,
                _souls[1],
                _souls,
                1,
                _lilyPadGovernorContract,
                networkConfig[currentNetWork()].votingDelay,
                networkConfig[currentNetWork()].votingPeriod,
                networkConfig[currentNetWork()].executorMinDelay
            );

            //check if requester balance changed
            const finalBalance = await _web3.eth.getBalance(user.address);
            console.log(`Requester Final Balance: ${_web3.utils.fromWei(finalBalance, "ether")}`);

            assert(
                BigNumber.from(finalBalance).gt(initialBalance),
                "Proposal not executed correctly :-("
            );
        });
        it("TreasureTest::03::Try to propose funds request, dont approve and try to queue. It should revert", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
            const _web3: Web3 = web3;

            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];

            const initialTreasureBalance = await _lilyPadTreasureContract.daoTreasure();

            console.log(
                `************************************** Checking Treasure ********************************`
            );

            const treasureBalance = await _lilyPadTreasureContract.daoTreasure();

            assert(treasureBalance.gt(0), "Treasure did not received fees :-(");

            console.log(
                `Treasure owns ${await web3.utils.fromWei(
                    treasureBalance.toString(),
                    "ether"
                )} eth!`
            );

            console.log(
                `************************************** Propose and Voting ******************************************`
            );

            //proposal description can be plain text or a ipfs hash with the description
            //i recommend the ipfs hash. this way the proposals can be well descripted without make unviable to propose
            const PROPOSAL_DESCRIPTION =
                "bafkreicwrdofqb56rkspleeo3deyxpl4ku23bncxrsozfh6mr7pgsmjkge";
            const args = [BASE_FEE, user.address];

            const factory = await ethers.getContractFactory("LilyPadTreasure");
            const PROPOSAL_FUNCTION = factory.interface.encodeFunctionData(
                "withdrawFromTreasure",
                args
            );

            await chainMine(2);

            //total voting supply
            console.log(`Total voting suply: ${await _pondSBTContract.totalSupply()}`);

            //check requester initial balance
            const initialBalance = await _web3.eth.getBalance(user.address);
            console.log(
                `Requester Initial Balance: ${_web3.utils.fromWei(initialBalance, "ether")}`
            );

            await executeDaoProcess(
                [_lilyPadTreasureContract.address],
                [0],
                [PROPOSAL_FUNCTION],
                PROPOSAL_DESCRIPTION,
                _souls[1],
                _souls,
                0,
                _lilyPadGovernorContract,
                networkConfig[currentNetWork()].votingDelay,
                networkConfig[currentNetWork()].votingPeriod,
                networkConfig[currentNetWork()].executorMinDelay
            );

            //check if requester balance changed
            const finalBalance = await _web3.eth.getBalance(user.address);
            console.log(`Requester Final Balance: ${_web3.utils.fromWei(finalBalance, "ether")}`);

            assert(
                BigNumber.from(finalBalance).eq(initialBalance),
                "Non Approved Proposal executed :-()"
            );
        });
    });
});*/
