import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import deployLilyPad from "../deploy/01-deploy-lilyPad";
import deployLilyPadDao from "../deploy/03-deploy-lilyPadDao";
import deployLilyPadTreasure from "../deploy/04-deploy-lilyPadTreasure";
import {
    ILilyPad,
    LilyPad,
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

const hre = require("hardhat");
describe("PondSBT", function () {
    const { deployments, getNamedAccounts, web3, ethers } = require("hardhat");
    const { get } = deployments;
    const BASE_FEE = ethers.utils.parseEther("0.25");

    let _lilyPadContract: LilyPad;
    let _pondSBTContract: PondSBT;
    let _lilyPadTreasureContract: LilyPadTreasure;
    let _member: MemberStruct;
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

        assert(_lilyPadContract, "Could not deploy lilyPad");
        assert(_pondSBTContract, "Could not deploy PondSBT");
        assert(_lilyPadTreasureContract, "Could not deploy Treasure");

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

        //create member
        const name: string = "Mirthis";
        const initialXp: number = 1;
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

        _lilyPadContract = await _lilyPadContract.connect(user);

        const memberTx = await _lilyPadContract.createMember(
            initialXp,
            completedCourses,
            badges,
            signedData
        );

        await memberTx.wait(1);

        const memberValues = await _lilyPadContract.getMember(user.address);

        _member = {
            pathChosen: memberValues.pathChosen,
            xp: memberValues.xp,
            level: memberValues.level,
            DAO: memberValues.DAO,
            tokenId: memberValues.tokenId,
            completedEvents: memberValues.completedEvents,
            badges: memberValues.badges,
        };
    });
    describe("MintFunctions", function () {
        it("MintFunctions::01::Try to mint pondSBT to member. It should work with no problems", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];
            const _web3: Web3 = web3;

            console.log(`${await _lilyPadContract.owner()}`);
            console.log(
                `Deployer ${deployer} funds: ${_web3.utils.fromWei(
                    await _web3.eth.getBalance(deployer),
                    "ether"
                )} eth`
            );

            const mintTx = await _lilyPadContract.mintTokenForMember(user.address, {
                value: BASE_FEE,
            });
            await mintTx.wait(1);

            const memberValues = await _lilyPadContract.getMember(user.address);

            console.log(`Member ${user.address} minted token ${memberValues.tokenId}`);

            let buff = Buffer.from(
                await (
                    await _lilyPadContract.constructTokenUri(1, "ipfs://")
                ).replace("data:application/json;base64,", ""),
                "base64"
            );
            let text = buff.toString("ascii");
            console.log(`tokenUri: ${text}`);
            console.log(
                `Member XP: ${(await _lilyPadContract.getMember(user.address)).xp.toString()}`
            );

            console.log(
                `Member Level: ${(await _lilyPadContract.getMemberLevel(user.address)).toString()}`
            );

            console.log(
                `PondBT Contract funds: ${await _web3.eth.getBalance(_pondSBTContract.address)}`
            );
            console.log(
                `Lilypad Contract funds: ${await _web3.eth.getBalance(_lilyPadContract.address)}`
            );
            const funds = await _lilyPadTreasureContract.daoTreasure();
            console.log(
                `Deployer ${deployer} funds: ${_web3.utils.fromWei(
                    await _web3.eth.getBalance(deployer),
                    "ether"
                )} eth`
            );
            console.log(
                `Lilypad Treasure funds: ${_web3.utils.fromWei(funds.toString(), "ether")} eth`
            );

            assert(memberValues.tokenId.gt(0), "Token not minted");
        });
    });
    describe("BurnFunctions", function () {
        it("BurnFunctions::01::Try to burn pondSBT. It should burn membership too", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];
            const _web3: Web3 = web3;

            const mintTx = await _lilyPadContract.mintTokenForMember(user.address, {
                value: BASE_FEE,
            });
            await mintTx.wait(1);

            let memberValues = await _lilyPadContract.getMember(user.address);

            console.log(`Member ${user.address} minted token ${memberValues.tokenId}`);

            let buff = Buffer.from(
                await (
                    await _lilyPadContract.constructTokenUri(1, "ipfs://")
                ).replace("data:application/json;base64,", ""),
                "base64"
            );
            let text = buff.toString("ascii");
            console.log(`tokenUri: ${text}`);
            console.log(
                `Member XP: ${(await _lilyPadContract.getMember(user.address)).xp.toString()}`
            );

            console.log(
                `Member Level: ${(await _lilyPadContract.getMemberLevel(user.address)).toString()}`
            );

            console.log(
                `PondBT Contract funds: ${await _web3.eth.getBalance(_pondSBTContract.address)}`
            );
            console.log(
                `Lilypad Contract funds: ${await _web3.eth.getBalance(_lilyPadContract.address)}`
            );

            assert(memberValues.tokenId.gt(0), "Token not minted");

            console.log(`Owner of token: ${await _pondSBTContract.ownerOf(memberValues.tokenId)}`);
            //burn token
            const burnTx = await _pondSBTContract.connect(user).burn(memberValues.tokenId);
            await burnTx.wait(1);

            memberValues = await _lilyPadContract.getMember(user.address);

            console.log(`Member ${user.address} token id after burn: ${memberValues.tokenId}`);
            console.log(`Member Level after burn: ${memberValues.level}`);
        });
    });
});
