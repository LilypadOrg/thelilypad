import { task } from "hardhat/config"
import {
  LilyPad,
} from "../typechain-types"
export default task(
  "get-member",
  "Show member data"
).addParam("account", "The account's address")
  .setAction(async (taskArguments, hre) => {
  const { deployments} = require("hardhat");
  const { get } = deployments;
  
  const chainId = hre.network.config.chainId
       
  const lilyPadContract: LilyPad = await get("LilyPad")

  const tokenId = await lilyPadContract.getMember(taskArguments.account)


  console.log(`Member Level: ${tokenId.level)
  console.log(`Member Token Id: ${tokenId.tokenId}`)
})
