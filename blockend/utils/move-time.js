const { network } = require("hardhat")

async function moveTime(amount) {
    console.log("Advancing time...")
    await network.provider.send("evm_increaseTime", [amount])
    console.log(`Time advanced ${amount} seconds`)
}

module.exports = { moveTime }
