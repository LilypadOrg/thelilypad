import { ethers, getNamedAccounts, deployments } from "hardhat";
import { LilyPad, Main, PondSBT } from "../typechain-types";

async function getMember() {
    const { get } = deployments;
    const lilyPad = await get("LilyPad");
    const lilyPadContract: LilyPad = (await ethers.getContractAt(
        "LilyPad",
        lilyPad.address
    )) as LilyPad;

    const pontSbt = await get("PondSBT");
    const pontSbtContract: PondSBT = (await ethers.getContractAt(
        "PondSBT",
        pontSbt.address
    )) as PondSBT;

    const member = await lilyPadContract.getMember("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");

    console.log(`Member Level: ${member.level}`);
    console.log(`Member XP: ${member.xp}`);
    console.log(`Member Token Id: ${member.tokenId}`);

    //get tokenUri
    const tokenURI = await pontSbtContract.tokenURI(member.tokenId);

    console.log(tokenURI);
}

getMember()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
