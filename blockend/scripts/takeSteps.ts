import { ethers, getNamedAccounts, deployments } from "hardhat"
import { Main, MainV2, PondSBT } from "../typechain-types"

async function takeSteps() {
    const { deployer } = await getNamedAccounts()
    const { get } = deployments

    const mainV2 = await get("MainV2")
    const MainV2 = (await ethers.getContractAt("MainV2", mainV2.address)) as MainV2

    const pondSBT = (await ethers.getContract("PondSBT")) as PondSBT
    await pondSBT.takeFirstSteps({ value: ethers.utils.parseEther("0.1") })
    const memberStepped = await MainV2.getMember(deployer)
    console.log(`Member minted: ${memberStepped}`)
    const memberSBT = await pondSBT.tokenURI("0")
    console.log("Member SBT is : ", memberSBT)

    const newVariable = await MainV2.newVariable()

    console.log(`New Variable added, just upgrade thing : ${newVariable.toString()}`)
}
takeSteps()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
