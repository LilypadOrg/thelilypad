import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import deployLilyPad from "../deploy/01-deploy-lilyPad";
import { ILilyPad, LilyPad, LilyPad__factory, PondSBT, PondSBT__factory } from "../typechain-types";
import Web3 from "web3";
import { EventSubmitedEventObject } from "../typechain-types/contracts/LilyPad";
import deployPondSBT from "../deploy/02-deploy-pondSBT";
import { readSvgContent } from "../scripts/svgUtils";

const hre = require("hardhat");
describe("LilyPad", function () {
    const { deployments, getNamedAccounts, web3, ethers } = require("hardhat");
    const { get } = deployments;
    const BASE_FEE = ethers.utils.parseEther("0.25");
    let _lilyPadContract: LilyPad;
    let _pondSBTContract: PondSBT;
    beforeEach(async function () {
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
    });
    describe("Eventfunctions", function () {
        it("Eventfunctions::01::Try to submit course with correct signature from safeCaller. It should work with no problems", async function () {
            const { deployer } = await getNamedAccounts();
            const safeCaller = deployer;
            const _web3: Web3 = web3;

            var courseArray: ILilyPad.AccoladeStruct[] = [];

            courseArray.push({
                eventId: 0,
                title: web3.utils.fromAscii("Primeiro curso"),
                badge: web3.utils.fromAscii("BADGE SVG"),
            });

            var firstValues = courseArray.map((i) => {
                return (
                    i.eventId.toString() + web3.utils.toAscii(i.title) + web3.utils.toAscii(i.badge)
                );
            });

            //console.log(firstValues.join());
            const hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: 1 },
                { t: "uint256", v: 1 },
                { t: "bytes", v: web3.utils.fromAscii("Basic Solidity Course") },
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: firstValues.join(),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract.submitEvent(
                1,
                1,
                web3.utils.fromAscii("Basic Solidity Course"),
                10,
                [
                    {
                        eventId: 0,
                        title: web3.utils.fromAscii("Primeiro curso"),
                        badge: web3.utils.fromAscii("BADGE SVG"),
                    },
                ],
                signedData
            );

            const submitCourseReceipt = await courseTx.wait(1);
            var courseId: BigNumber;
            //check if course was created
            const course = await _lilyPadContract.getEvent(1);

            assert(course.eventTypeId.eq(1), "Course not created");
        });
        it("Eventfunctions::02::Try to submit course with diferente data from signature. It should revert", async function () {
            const { deployer } = await getNamedAccounts();
            const safeCaller = deployer;

            var courseArray: ILilyPad.AccoladeStruct[] = [];
            courseArray.push({
                eventId: 0,
                title: web3.utils.fromAscii("Primeiro curso"),
                badge: web3.utils.fromAscii("BADGE SVG"),
            });

            var firstValues = courseArray.map((i) => {
                return (
                    i.eventId.toString() + web3.utils.toAscii(i.title) + web3.utils.toAscii(i.badge)
                );
            });

            const hash = await web3.utils.soliditySha3(
                { t: "uint256", v: 1 },
                { t: "uint256", v: 1 },
                { t: "bytes", v: web3.utils.fromAscii("Basic Solidity Course") },
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: firstValues.join(),
                }
            );
            const signedData = web3.eth.sign(hash!, safeCaller);

            try {
                const courseTx = await _lilyPadContract.submitEvent(
                    1,
                    1,
                    web3.utils.fromAscii("Basic Solidity Course"),
                    20,
                    courseArray,
                    signedData
                );

                const submitCourseReceipt = await courseTx.wait(1);
                var courseId: BigNumber;
                //check if course was created
                const course = await _lilyPadContract.getEvent(1);
            } catch (err: any) {
                console.log(`Course submition reverted: ${err.message}`);
            }

            //check if course was created
            const course = await _lilyPadContract.getEvent(1);
            assert(course.accolades.length <= 0, "Course created from malicious request :-(");
        });
        it("Eventfunctions::03::Try to submit course with multiple accolades. It should work with no problems", async function () {
            const { deployer } = await getNamedAccounts();
            const _web3: Web3 = web3;
            const safeCaller = deployer;

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
                return (
                    i.eventId.toString() + web3.utils.toAscii(i.title) + web3.utils.toAscii(i.badge)
                );
            });

            //console.log(flattenedArray.join(""));
            const hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: 1 },
                { t: "uint256", v: 1 },
                { t: "bytes", v: web3.utils.fromAscii("Basic Solidity Course") },
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: flattenedArray.join(""),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract.submitEvent(
                1,
                1,
                web3.utils.fromAscii("Basic Solidity Course"),
                10,
                courseArray,
                signedData
            );

            const submitCourseReceipt = await courseTx.wait(1);
            var courseId: BigNumber;
            //check if course was created
            const course = await _lilyPadContract.getEvent(1);

            assert(course.eventTypeId.eq(1), "Course not created");
            assert(course.accolades.length > 1, "Course not created with multiple accolades");
        });
        it("Eventfunctions::04::Try to subscribe course with multiple accolades with no typing. It should work with no problems", async function () {
            const { deployer } = await getNamedAccounts();
            const _web3: Web3 = web3;
            const safeCaller = deployer;

            var courseArray: any[] = [];

            courseArray.push([
                0,
                web3.utils.fromAscii("BEGINER"),
                web3.utils.fromAscii("BEGINER BADGE SVG"),
            ]);
            courseArray.push([
                0,
                web3.utils.fromAscii("ADVANCED"),
                web3.utils.fromAscii("ADVANCED BADGE SVG"),
            ]);

            var flattenedArray: string[] = courseArray.map((i) => {
                return (
                    i[0].toString() +
                    web3.utils.toAscii(i[1].toString()) +
                    web3.utils.toAscii(i[2].toString())
                );
            });

            //console.log(flattenedArray.join(""));
            const hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: 1 },
                { t: "uint256", v: 1 },
                { t: "bytes", v: web3.utils.fromAscii("Basic Solidity Course") },
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: flattenedArray.join(""),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract.submitEvent(
                1,
                1,
                web3.utils.fromAscii("Basic Solidity Course"),
                10,
                courseArray,
                signedData
            );

            const submitCourseReceipt = await courseTx.wait(1);
            var courseId: BigNumber;
            //check if course was created
            const course = await _lilyPadContract.getEvent(1);

            assert(course.eventTypeId.eq(1), "Course not created");
            assert(course.accolades.length > 1, "Course not created with multiple accolades");
        });
    });
    describe("Memberfunctions", function () {
        it("Memberfunctions::01::Try to submit member with correct signature from safeCaller. It should work with no problems", async function () {
            //create member
            const { deployer } = await getNamedAccounts();
            const safeCaller = deployer;

            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];
            const _web3: Web3 = web3;

            const initialXp: number = 1000;
            var completedCourses: number[] = [10001, 10002];

            var badges: any[] = []; //badges is just an accolade array
            var flattenedBadgesArray = badges.map((i) => {
                return (
                    i[0].toString() +
                    web3.utils.toAscii(i[1].toString()) +
                    web3.utils.toAscii(i[2].toString())
                );
            });

            //generates sig data
            const hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: initialXp },
                ...completedCourses,
                {
                    t: "string",
                    v: flattenedBadgesArray.join(""),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract
                .connect(user)
                .createMember(initialXp, completedCourses, badges, signedData);

            await courseTx.wait(1);

            const _member = await _lilyPadContract.getMember(user.address);

            assert(_member.pathChosen, "Member not created :-(");
        });
        it("Memberfunctions::02::Try to submit member with incorrect signature from safeCaller. It should revert", async function () {
            //create member
            const { deployer } = await getNamedAccounts();
            const safeCaller = deployer;
            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];
            const _web3: Web3 = web3;

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
            const hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: initialXp },
                ...completedCourses,
                {
                    t: "string",
                    v: flattenedBadgesArray.join(""),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            try {
                const courseTx = await _lilyPadContract
                    .connect(user)
                    .createMember(initialXp * 2, completedCourses, badges, signedData);

                await courseTx.wait(1);
            } catch (err: any) {
                console.error(err.message);
            }

            const _member = await _lilyPadContract.getMember(user.address);

            assert(!_member.pathChosen, "Member created with malicious data :-(");
        });
        it("Memberfunctions::03::Complete course and checks if it reflects in SBT tokenUri. It should return the complete course data in the token Uri", async function () {
            //create member
            const { deployer } = await getNamedAccounts();
            const safeCaller = deployer;
            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];
            const _web3: Web3 = web3;

            const initialXp: number = 0;
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
            let hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: initialXp },
                ...completedCourses,
                {
                    t: "string",
                    v: flattenedBadgesArray.join(""),
                }
            );

            let signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract
                .connect(user)
                .createMember(initialXp, completedCourses, badges, signedData);

            await courseTx.wait(1);

            const _member = await _lilyPadContract.getMember(user.address);

            assert(_member.pathChosen, "Member not created :-(");
            //mint token
            const mintTx = await _lilyPadContract
                .connect(user)
                .mintTokenForMember(user.address, { value: BASE_FEE });

            await mintTx.wait(1);

            let memberValues = await _lilyPadContract.getMember(user.address);

            assert(memberValues.tokenId.gt(0), "Token not minted :-(");

            assert(
                memberValues.completedEvents.length == 0,
                "Wrong number of completed events :-("
            );

            let tokenUri = await _pondSBTContract.tokenURI(memberValues.tokenId);

            let buff = Buffer.from(tokenUri.replace("data:application/json;base64,", ""), "base64");
            let text = buff.toString("ascii");
            let initialTokenUri = JSON.parse(text);

            assert(initialTokenUri.attributes.length == 1, "wrong number of attributes");
            let completedEvent = 10003;
            //generates sig data
            hash = (web3 as Web3).utils.soliditySha3(
                { t: "address", v: user.address },
                { t: "uint256", v: completedEvent }
            );

            signedData = await web3.eth.sign(hash!, safeCaller);

            console.log(`Signed data: ${signedData}`);
            const completeEventTx = await _lilyPadContract.completeEvent(
                user.address,
                completedEvent,
                signedData
            );

            await completeEventTx.wait(1);

            memberValues = await _lilyPadContract.getMember(user.address);
            console.log(`Member xp after course completion: ${memberValues.xp}`);
            assert(
                memberValues.completedEvents.length == 1,
                "Wrong number of completed events :-("
            );

            tokenUri = await _pondSBTContract.tokenURI(memberValues.tokenId);

            buff = Buffer.from(tokenUri.replace("data:application/json;base64,", ""), "base64");
            text = buff.toString("ascii");
            let finalTokenUri = JSON.parse(text);

            console.log(`tokenUri: ${text}`);

            assert(finalTokenUri.attributes.length == 2, "Wrong count of attributes");
        });
        it("Memberfunctions::04::award badge and checks if it reflects in SBT tokenUri. It should return the complete course data in the token Uri", async function () {
            //create member
            const { deployer } = await getNamedAccounts();
            const safeCaller = deployer;
            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];
            const _web3: Web3 = web3;

            const initialXp: number = 0;
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
            let hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: initialXp },
                ...completedCourses,
                {
                    t: "string",
                    v: flattenedBadgesArray.join(""),
                }
            );

            let signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract
                .connect(user)
                .createMember(initialXp, completedCourses, badges, signedData);

            await courseTx.wait(1);

            const _member = await _lilyPadContract.getMember(user.address);

            assert(_member.pathChosen, "Member not created :-(");

            //mint token
            const mintTx = await _lilyPadContract
                .connect(user)
                .mintTokenForMember(user.address, { value: BASE_FEE });

            await mintTx.wait(1);

            let memberValues = await _lilyPadContract.getMember(user.address);

            assert(memberValues.tokenId.gt(0), "Token not minted :-(");
            assert(
                memberValues.completedEvents.length == 0,
                "Wrong number of completed events :-("
            );

            let tokenUri = await _pondSBTContract.tokenURI(memberValues.tokenId);

            let buff = Buffer.from(tokenUri.replace("data:application/json;base64,", ""), "base64");
            let text = buff.toString("ascii");

            let initialTokenUri = JSON.parse(text);

            assert(initialTokenUri.attributes.length == 1, "wrong number of attributes");

            let completedEvent = 10003;
            //generates sig data
            hash = (web3 as Web3).utils.soliditySha3(
                { t: "address", v: user.address },
                { t: "uint256", v: completedEvent }
            );

            signedData = await web3.eth.sign(hash!, safeCaller);

            console.log(`Signed data: ${signedData}`);
            const completeEventTx = await _lilyPadContract.completeEvent(
                user.address,
                completedEvent,
                signedData
            );

            await completeEventTx.wait(1);

            //generates sig data
            var accoladesArray: any[] = [];

            accoladesArray.push([
                10003,
                web3.utils.fromAscii("Beginner"),
                web3.utils.fromAscii("N/A"),
            ]);

            flattenedBadgesArray = accoladesArray.map((i) => {
                return (
                    i[0].toString() +
                    web3.utils.toAscii(i[1].toString()) +
                    web3.utils.toAscii(i[2].toString())
                );
            });

            const badgeAwardHash = (web3 as Web3).utils.soliditySha3(
                user.address,
                flattenedBadgesArray.join("")
            );

            const badgeAwardSignedData = await web3.eth.sign(badgeAwardHash!, safeCaller);

            const awardBadgeTx = await _lilyPadContract.awardBadge(
                user.address,
                accoladesArray,
                badgeAwardSignedData
            );

            await awardBadgeTx.wait(1);

            memberValues = await _lilyPadContract.getMember(user.address);

            assert(memberValues.badges.length == 1, "Wrong number of badges :-(");

            tokenUri = await _pondSBTContract.tokenURI(memberValues.tokenId);

            buff = Buffer.from(tokenUri.replace("data:application/json;base64,", ""), "base64");
            text = buff.toString("ascii");

            let finalTokenUri = JSON.parse(text);

            console.log(`tokenUri: ${text}`);

            assert(finalTokenUri.badges.length == 1, "Wrong count of badges");
        });
        it("Memberfunctions::05::Try to update member with correct signature from safeCaller. It should work with no problems", async function () {
            //create member
            const { deployer } = await getNamedAccounts();
            const safeCaller = deployer;
            const accounts: any[] = await ethers.getSigners();
            const user = accounts[1];
            const _web3: Web3 = web3;

            const initialXp: number = 0;
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
            let hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: initialXp },
                ...completedCourses,
                {
                    t: "string",
                    v: flattenedBadgesArray.join(""),
                }
            );

            let signedData = await web3.eth.sign(hash!, safeCaller);

            const courseTx = await _lilyPadContract
                .connect(user)
                .createMember(initialXp, completedCourses, badges, signedData);

            await courseTx.wait(1);

            let _member = await _lilyPadContract.getMember(user.address);

            assert(_member.pathChosen, "Member not created :-(");

            //try to update member data
            badges = []; //badges is just an accolade array
            badges.push([1, web3.utils.fromAscii("BEGINER"), web3.utils.fromAscii("N/A")]);

            completedCourses = [1];

            flattenedBadgesArray = badges.map((i) => {
                return (
                    i[0].toString() +
                    web3.utils.toAscii(i[1].toString()) +
                    web3.utils.toAscii(i[2].toString())
                );
            });

            const { xp, accolades } = await _lilyPadContract.getEvent(1);
            const currentXp = Number(xp) + initialXp;
            console.log(`Event xp: ${xp}`);

            //generates sig data
            hash = _web3.utils.soliditySha3(
                { t: "address", v: user.address },
                true,
                { t: "uint256", v: currentXp },
                ...completedCourses,
                {
                    t: "string",
                    v: flattenedBadgesArray.join(""),
                }
            );

            signedData = await web3.eth.sign(hash!, safeCaller);

            const memberUpdtTx = await _lilyPadContract.updateMember(
                user.address,
                true,
                currentXp,
                completedCourses,
                badges,
                signedData
            );
            const memberUpdtReceipt = await memberUpdtTx.wait(1);

            _member = await _lilyPadContract.getMember(user.address);

            const _earned = await _lilyPadContract.badgeEarned(
                user.address,
                1,
                web3.utils.fromAscii("BEGINER")
            );
            assert(_member.xp.eq(currentXp), "Member not updated :-(");
            assert(_earned, "Member not updated. Badge not earned :-(");
            assert(_earned, "Member not updated :-(");
        });
    });
});
