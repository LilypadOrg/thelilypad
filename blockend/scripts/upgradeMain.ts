import { ethers, getNamedAccounts, deployments, upgrades } from "hardhat"
import { Main, MainV2, PondSBT } from "../typechain-types"

async function upgradeMain() {
    const { deployer } = await getNamedAccounts()
    const { get, save } = deployments

    const main = await get("Main")

    const MainV2 = await ethers.getContractFactory("MainV2")
    console.log("Upgrading to V2...")
    const mainV2 = (await upgrades.upgradeProxy(main.address, MainV2, {
        call: { fn: "intializeNewVariable", args: ["4"] },
    })) as MainV2

    console.log(mainV2.address, " Main(proxy) address, Hopefully remains same 🙏")
    console.log(
        await upgrades.erc1967.getImplementationAddress(main.address),
        " getImplementationAddress it should change !"
    )
    console.log(await upgrades.erc1967.getAdminAddress(main.address), " getAdminAddress")

    const artifact = await deployments.getArtifact("MainV2")

    console.log("Upgraded!!!")

    const member = await mainV2.getMember(deployer)
    console.log("Checking if the member is still preserved after upgrade", member.toString())

    await save("MainV2", {
        address: main.address,
        ...artifact,
    })
}
upgradeMain()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
