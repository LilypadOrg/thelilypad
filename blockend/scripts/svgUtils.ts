import fs from "fs";

export function readSvgContent(filePath: string): string {
    return fs
        .readFileSync(filePath, { encoding: "ascii" })
        .replace(/"/g, "'")
        .replace(/(?:\r\n|\r|\n)/g, "");
}
