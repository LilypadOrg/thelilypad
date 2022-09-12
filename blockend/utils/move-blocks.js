const { network } = require("hardhat")
function sleep(timeinMs) {
    return new Promise((resolve) => setTimeout(resolve, timeinMs))
}
async function moveBlocks(amount, sleepAmount = 0) {
    console.log("Moving blocks...")
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
        if (sleepAmount) {
            console.log(`Sleeping for ${sleepAmount}Ms`)
            await sleep(sleepAmount)
        }
    }
}

module.exports = { moveBlocks, sleep }
