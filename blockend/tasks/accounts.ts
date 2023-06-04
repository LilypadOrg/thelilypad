import { task } from "hardhat/config"

export default task("accounts", "Prints the list of accounts").setAction(async (_, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})
