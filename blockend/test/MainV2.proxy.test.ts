import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { Contract, ContractFactory, Signer } from "ethers";
import { deployments, ethers, getNamedAccounts, upgrades } from "hardhat";
import { ContractType } from "hardhat/internal/hardhat-network/stack-traces/model";
import { Main, MainV2, PondSBT as PondSBTType } from "../typechain-types";
import fs from "fs";

describe("Main (proxy)", function () {
    let Main: ContractFactory;
    let main: Main;
    let MainV2: ContractFactory;
    let PondSBT: ContractFactory;
    let pondSBT: PondSBTType;
    let deployer: SignerWithAddress;
    let member: SignerWithAddress;

    beforeEach(async () => {
        Main = await ethers.getContractFactory("Main");
        main = (await upgrades.deployProxy(Main)) as Main;

        PondSBT = await ethers.getContractFactory("PondSBT");
        const mintFee = ethers.utils.parseEther("0.1");
        const levelSVGs = [
            fs.readFileSync("images/level0.svg", { encoding: "utf8" }),
            fs.readFileSync("images/level1.svg", { encoding: "utf8" }),
        ];
        const args = [mintFee, levelSVGs, main.address];
        pondSBT = (await PondSBT.deploy(mintFee, levelSVGs, main.address)) as PondSBTType;
        await pondSBT.deployed();

        MainV2 = await ethers.getContractFactory("MainV2");

        const signers = await ethers.getSigners();
        deployer = signers[0];
        member = signers[1];
    });

    it("Deploy new proxy and access 'NEW Variable' as 4", async function () {
        let mainV2 = (await upgrades.upgradeProxy(main.address, MainV2, {
            call: { fn: "intializeNewVariable", args: ["4"] },
        })) as MainV2;
        const newVariableValue = await mainV2.newVariable();
        assert.strictEqual(newVariableValue.toString(), "4");
    });

    it("Should 'createMember','level up member', and use it from previous version, 'getTokenURI'", async function () {
        // ! need to discuss
        console.log("Creating a member in version 1 🙋‍♂️");
        await main.connect(member).createMember("Equious");
        console.log("Member created 🙋‍♂️");

        console.log("Leveling up ⏫ the member in version 1");
        await main.connect(member).levelMember();
        console.log("Equious level upped ! ");

        console.log("Deploying V2.....");
        let mainV2 = (await upgrades.upgradeProxy(main.address, MainV2, {
            call: { fn: "intializeNewVariable", args: ["4"] },
        })) as MainV2;

        const [name] = await mainV2.getMember(member.address);

        //const tokenId = await pondSBT.callStatic.claimSBT("blah")

        //const txnResponse = await pondSBT.connect(member).claimSBT("blah")
        //await txnResponse.wait()

        //const tokenURI = await pondSBT.tokenURI("0")

        //console.log("New TokenURI", tokenURI)
        //assert.strictEqual(name, "Equious")
    });
});
