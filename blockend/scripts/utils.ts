import { ethers } from "hardhat";

export const burnAddress = "0x0000000000000000000000000000000000000000";

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
