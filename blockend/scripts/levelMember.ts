import { ethers, getNamedAccounts, deployments } from "hardhat"
import { Main, PondSBT } from "../typechain-types"

async function levelMember() {
    const { deployer } = await getNamedAccounts()
    const { get } = deployments

    const main = await get("Main")
    const Main = (await ethers.getContractAt("Main", main.address)) as Main

    const pondSBT = (await ethers.getContract("PondSBT")) as PondSBT

    console.log("Leveling member")
    const leveledMember = await Main.levelMember()
    await leveledMember.wait(1)
    const memberLeveled = await Main.getMember(deployer)
    console.log(memberLeveled.toString())

    /*  leveling up member is not minting the token */
    // const memberSBT = await pondSBT.tokenURI("0")
    // console.log(memberSBT)
}
levelMember()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
