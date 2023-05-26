import { ethers, network } from "hardhat";
import Web3 from "web3";

export const burnAddress = "0x0000000000000000000000000000000000000000";

export function getSignatureParameters(signature: string, web3: Web3) {
    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    let vString = `0x${signature.slice(130, 132)}`;
    let v = web3.utils.toDecimal(vString);

    if (![27, 28].includes(v)) v += 27;

    return {
        r,
        s,
        v,
    };
}

export async function getAccount(accountType: string, qtty: number = 0) {
    const { ethers, network } = require("hardhat");
    const accounts: any[] = await ethers.getSigners();

    if (accountType.toLowerCase() == "owner" || accountType.toLowerCase() == "vetoer")
        return accounts[0];
    else if (accountType.toLowerCase() == "malicious") return accounts[1];
    else if (accountType.toLowerCase() == "souls") {
        let souls: any[] = [];
        if (network.config.chainId != 1337) {
            console.log("No souls key on live network");
            return souls;
        }

        if (qtty >= 1) {
            for (let idx = 0; idx < qtty; idx++) {
                souls.push(accounts[idx + 2]);
            }
        } else souls.push(accounts[2]);
        return souls;
    }
}

export function encode_function_data(initializer?: any, args?: any[]) {
    const { web3 } = require("hardhat");
    //const { web3: Web3 } = require("@nomiclabs/hardhat-web3");

    if ((args?.length ?? 0) == 0 || !initializer) return web3.utils.hexToBytes("0x");

    return initializer.encode_input(args);
}

export function hexToAscii(hex: string) {
    if (!hex) {
        return hex;
    }
    if (hex.startsWith("0x")) {
        hex = hex.slice(2);
    }
    let result = "";
    for (let n = 0; n < hex.length; n += 2) {
        result += String.fromCharCode(parseInt(hex.slice(n, n + 2), 16));
    }
    return result;
}

export function asciiToHex(ascii: string) {
    if (!ascii) {
        return "";
    }
    let result = "";
    for (let i = 0; i < ascii.length; i += 1) {
        const hex = ascii.charCodeAt(i).toString(16);
        result += `0${hex}`.slice(-2);
    }
    return `0x${result}`;
}

export async function chainSleep(snoozzeTime: number) {
    const { network, ethers } = require("hardhat");
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    await network.provider.send("evm_mine", [blockBefore.timestamp + snoozzeTime]);
}

export async function chainMine(blocks: number) {
    const helpers = require("@nomicfoundation/hardhat-network-helpers");
    helpers.mine(blocks);
}

export function currentNetWork(): number {
    return network.config.chainId ?? 1337;
}
