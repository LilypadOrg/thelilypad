import type {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PayableOverrides,
    PopulatedTransaction,
    Signer,
    utils,
} from "ethers";

import type {
    TypedEventFilter,
    TypedEvent,
    TypedListener,
    OnEvent,
    PromiseOrValue,
} from "../typechain-types/common";

import type { ILilyPad } from "../typechain-types";

export type MemberStruct = {
    pathChosen: PromiseOrValue<Boolean>;
    xp: PromiseOrValue<BigNumberish>;
    level: PromiseOrValue<BigNumberish>;
    DAO: PromiseOrValue<Boolean>;
    tokenId: PromiseOrValue<BigNumberish>;
    completedEvents: PromiseOrValue<BigNumberish[]>;
    badges: PromiseOrValue<ILilyPad.AccoladeStruct[]>;
};
