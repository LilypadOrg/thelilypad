import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import deployLilyPad from "../deploy/01-deploy-lilyPad";
import { ILilyPad, LilyPad, LilyPad__factory, PondSBT, PondSBT__factory } from "../typechain-types";
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
    let _member: MemberStruct;
    beforeEach(async function () {
        const { deployer, safeCaller } = await getNamedAccounts();
        const accounts: any[] = await ethers.getSigners();
        const user = accounts[1];

        await deployLilyPad(hre);
        await deployPondSBT(hre);

        const lilypadFactory: LilyPad__factory = await ethers.getContractFactory("LilyPad");
        const _lilyPadProxyContract = await get("LilyPadProxy");

        _lilyPadContract = await get("LilyPad");
        _lilyPadContract = await lilypadFactory.attach(_lilyPadProxyContract.address);

        const pondSBTFactory: PondSBT__factory = await ethers.getContractFactory("PondSBT");
        const _pondSbtProxyContract = await get("PondSBTProxy");

        _pondSBTContract = await pondSBTFactory.attach(_pondSbtProxyContract.address);

        assert(_lilyPadContract, "Could not deploy lilyPad");
        assert(_pondSBTContract, "Could not deploy PondSBT");

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
        const courseTx = await _lilyPadContract.submitEvent(
            1,
            1,
            web3.utils.fromAscii("Basic Solidity Course"),
            10,
            courseArray,
            signedData
        );

        console.log(`Course Data Signed: ${signedData}`);

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
        it("Try to mint pondSBT to member. It should work with no problems", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];
            const _web3: Web3 = web3;

            const mintTx = await _lilyPadContract.mintTokenForMember(
                user.address,
                _pondSBTContract.address,
                { value: BASE_FEE }
            );
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

            assert(memberValues.tokenId.gt(0), "Token not minted");
        });
    });
});
