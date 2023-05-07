import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { PromiseOrValue } from "../typechain-types/common";
import { ILilyPad } from "../typechain-types/contracts/LilyPad";

export type EventStructOutput = [
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    ILilyPad.AccoladeStruct[]
] & {
    id: BigNumber;
    eventTypeId: BigNumber;
    eventName: string;
    xp: BigNumber;
    level: BigNumber;
    technologies: BigNumber[];
};

export type EventStruct = {
    id: PromiseOrValue<BigNumberish>;
    eventTypeId: PromiseOrValue<BigNumberish>;
    eventName: PromiseOrValue<BytesLike>;
    xp: PromiseOrValue<BigNumberish>;
    level: PromiseOrValue<BigNumberish>;
    technologies: PromiseOrValue<BigNumberish>[];
};
