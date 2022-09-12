import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import deployLilyPad from "../deploy/03-deploy-lilyPad";
import { ILilyPad, LilyPad, LilyPad__factory } from "../typechain-types";
import Web3 from "web3";
import { EventSubmitedEventObject } from "../typechain-types/contracts/LilyPad";

const hre = require("hardhat");
describe("LilyPad", function () {
    const { deployments, getNamedAccounts, web3, ethers } = require("hardhat");
    const { get } = deployments;

    let _lilyPadContract: LilyPad;
    beforeEach(async function () {
        await deployLilyPad(hre);

        const lilypadFactory: LilyPad__factory = await ethers.getContractFactory("LilyPad");
        const _lilyPadProxyContract = await get("LilyPadProxy");

        _lilyPadContract = await get("LilyPad");
        _lilyPadContract = await lilypadFactory.attach(_lilyPadProxyContract.address);

        assert(_lilyPadContract, "Could not deploy lilyPad");
    });
    describe("Event functions", function () {
        it("Try to submit course with correct signature from safeCaller. It should work with no problems", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
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
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: firstValues.join(),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract.submitEvent(
                1,
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
        it("Try to submit course with diferente data from signature. It should revert", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();

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
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: firstValues.join(),
                }
            );
            const signedData = web3.eth.sign(hash!, safeCaller);

            try {
                const courseTx = await _lilyPadContract.submitEvent(1, 20, courseArray, signedData);

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
        it("Try to submit course with multiple accolades. It should work with no problems", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
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
                return (
                    i.eventId.toString() + web3.utils.toAscii(i.title) + web3.utils.toAscii(i.badge)
                );
            });

            //console.log(flattenedArray.join(""));
            const hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: 1 },
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: flattenedArray.join(""),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract.submitEvent(1, 10, courseArray, signedData);

            const submitCourseReceipt = await courseTx.wait(1);
            var courseId: BigNumber;
            //check if course was created
            const course = await _lilyPadContract.getEvent(1);

            assert(course.eventTypeId.eq(1), "Course not created");
            assert(course.accolades.length > 1, "Course not created with multiple accolades");
        });
        it("Try to subscribe course with multiple accolades with no typing. It should work with no problems", async function () {
            const { deployer, safeCaller } = await getNamedAccounts();
            const _web3: Web3 = web3;

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
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: flattenedArray.join(""),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract.submitEvent(1, 10, courseArray, signedData);

            const submitCourseReceipt = await courseTx.wait(1);
            var courseId: BigNumber;
            //check if course was created
            const course = await _lilyPadContract.getEvent(1);

            assert(course.eventTypeId.eq(1), "Course not created");
            assert(course.accolades.length > 1, "Course not created with multiple accolades");
        });
    });
    describe("Memberfunctions", function () {
        beforeEach(async function () {
            //deploy some courses
            const { deployer, safeCaller } = await getNamedAccounts();
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
                return (
                    i.eventId.toString() + web3.utils.toAscii(i.title) + web3.utils.toAscii(i.badge)
                );
            });

            //console.log(firstValues.join());
            const hash = (web3 as Web3).utils.soliditySha3(
                { t: "uint256", v: 1 },
                { t: "uint256", v: 10 },
                {
                    t: "string",
                    v: flattenedArray.join(""),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract.submitEvent(1, 10, courseArray, signedData);

            const submitCourseReceipt = await courseTx.wait(1);
            var eventId = 0;
            for (const ev of submitCourseReceipt.events!) {
                if (ev.event == "EventSubmited") {
                    eventId = ev.args!.eventId;
                }
            }
            assert(eventId == 1, "Event not Submited!");
        });
        it("Try to submit member with correct signature from safeCaller. It should work with no problems", async function () {
            //create member
            const { deployer, safeCaller } = await getNamedAccounts();
            const _web3: Web3 = web3;

            const name: string = "Mirthis";
            const initialXp: number = 1000;
            var completedCourses: number[] = [1];

            var badges: any[] = []; //badges is just an accolade array
            var flattenedBadgesArray = badges.map((i) => {
                return (
                    i[0].toString() +
                    web3.utils.toAscii(i[1].toString()) +
                    web3.utils.toAscii(i[2].toString())
                );
            });
            console.log(flattenedBadgesArray.join(""));
            //generates sig data
            const hash = (web3 as Web3).utils.soliditySha3(
                { t: "bytes", v: web3.utils.fromAscii(name) },
                { t: "uint256", v: initialXp },
                ...completedCourses,
                {
                    t: "string",
                    v: flattenedBadgesArray.join(""),
                }
            );

            const signedData = await web3.eth.sign(hash!, safeCaller);
            const courseTx = await _lilyPadContract.createMember(
                web3.utils.fromAscii(name),
                initialXp,
                completedCourses,
                badges,
                signedData
            );
        });
    });
});
