import { ethers, getNamedAccounts, deployments } from "hardhat"
import { Main } from "../typechain-types"

async function createMember() {
    const { deployer } = await getNamedAccounts()
    const { get } = deployments

    const main = await get("Main")
    const Main = (await ethers.getContractAt("Main", main.address)) as Main
    console.log("Creating Member...")
    const memberTx = await Main.createMember("Steve")
    await memberTx.wait(1)
    const member = await Main.getMember(deployer)
    console.log(`Member Created: ${member.toString()}`)
}
createMember()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
