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
    accolades: ILilyPad.AccoladeStruct[];
};

export type EventStruct = {
    id: PromiseOrValue<BigNumberish>;
    eventTypeId: PromiseOrValue<BigNumberish>;
    eventName: PromiseOrValue<BytesLike>;
    xp: PromiseOrValue<BigNumberish>;
    accolades: ILilyPad.AccoladeStruct[];
};
