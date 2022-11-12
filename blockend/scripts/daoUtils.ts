import { BigNumber, ContractReceipt } from "ethers";
import { LilyPadGovernor } from "../typechain-types";
import { chainMine, chainSleep, getAccount } from "./utils";
import Web3 from "web3";
import {
    ProposalCreatedEvent,
    ProposalQueuedEvent,
} from "../typechain-types/contracts/Governance/LilyPadGovernor";

const { deployments, getNamedAccounts, web3, ethers } = require("hardhat");
const _web3: Web3 = web3;
const gasPrice = "20"; //gwei

export async function propose(
    contractAddr: string[],
    values: any[],
    functionData: any[],
    proposer: any,
    proposalDescription: string,
    governor: LilyPadGovernor
): Promise<BigNumber> {
    governor = await governor.connect(proposer);

    const proposalTx = await governor["propose(address[],uint256[],bytes[],string)"](
        contractAddr,
        values,
        functionData,
        proposalDescription
    );

    const receipt = await proposalTx.wait(1);

    let mintCost = web3.utils.fromWei(
        receipt.cumulativeGasUsed
            .mul(BigNumber.from(_web3.utils.toWei(gasPrice, "gwei")))
            .toString(),
        "ether"
    );

    console.log(`Proposed! (${mintCost} eth at ${mintCost} gwei)`);

    let propId: BigNumber;
    for (const ev of receipt!!.events!!) {
        if (ev.event == "ProposalCreated") {
            propId = (ev as ProposalCreatedEvent).args.proposalId;
            console.log(`Proposal Id: ${propId}`);
        }
    }

    console.log(`Proposal snapshot ${await governor.proposalSnapshot(propId!!)}`);
    console.log(`Proposal deadline ${await governor.proposalDeadline(propId!!)}`);
    console.log(`Proposal State: ${proposalStatesEnum[await governor.state(propId!!)]}`);
    return propId!!;
}

export async function vote(
    _from: any,
    proposal_id: BigNumber,
    vote: number,
    reason: String,
    governor: LilyPadGovernor
): Promise<boolean> {
    let voteDesc = "IN FAVOR";
    let receipt: ContractReceipt;
    if (vote == 0) voteDesc = "AGAINST";
    else if (vote == 2) voteDesc = "ABSTAIN";
    //0 = Against, 1 = For, 2 = Abstain for this example
    //you can all the #COUNTING_MODE() function to see how to vote otherwise
    governor = await governor.connect(_from);
    try {
        if (reason) {
            const tx = await governor.castVoteWithReason(proposal_id, vote, reason.toString());
            receipt = await tx.wait(1);
        } else {
            const tx = await governor.castVote(proposal_id, vote);
            receipt = await tx.wait(1);
        }
    } catch (err: any) {
        console.error(err.message);
        return false;
    }

    let mintCost = web3.utils.fromWei(
        receipt.cumulativeGasUsed
            .mul(BigNumber.from(_web3.utils.toWei(gasPrice, "gwei")))
            .toString(),
        "ether"
    );

    console.log(
        `${_from.address} voting ${voteDesc} (votes: ${await governor.getVotes(
            _from.address,
            await governor.proposalSnapshot(proposal_id!!)
        )}) on ${proposal_id} (${mintCost} eth at ${gasPrice} gwei)`
    );

    return true;
}

export async function queue(
    _from: any,
    contractAddress: string[],
    values: any[],
    functionData: any[],
    proposalDescription: string,
    governor: LilyPadGovernor
): Promise<BigNumber> {
    const description_hash = ethers.utils.id(proposalDescription); //web3.utils.keccak256(proposalDescription)

    let scheduleId: BigNumber;
    try {
        governor = await governor.connect(_from);

        const tx = await governor["queue(address[],uint256[],bytes[],bytes32)"](
            contractAddress,
            values,
            functionData,
            description_hash
        );
        const receipt = await tx.wait(1);

        let mintCost = web3.utils.fromWei(
            receipt.cumulativeGasUsed
                .mul(BigNumber.from(web3.utils.toWei(gasPrice, "gwei")))
                .toString(),
            "ether"
        );

        console.log(`Queued! (${mintCost} eth at ${gasPrice} gwei)`);

        for (const ev of receipt!!.events!!) {
            if (ev.event == "ProposalQueued") {
                scheduleId = (ev as ProposalQueuedEvent).args.proposalId;
            }
        }
        return scheduleId!!;
    } catch (err: any) {
        console.log(err.message);
        return BigNumber.from("0");
    }
}

export async function execute(
    _from: any,
    contractAddress: string[],
    values: any[],
    functionData: any[],
    proposalDescription: string,
    governor: LilyPadGovernor
) {
    const description_hash = ethers.utils.id(proposalDescription);
    governor = await governor.connect(_from);

    try {
        const tx = await governor["execute(address[],uint256[],bytes[],bytes32)"](
            contractAddress,
            values,
            functionData,
            description_hash
        );
        const receipt = await tx.wait(1);

        let mintCost = web3.utils.fromWei(
            receipt.cumulativeGasUsed
                .mul(BigNumber.from(web3.utils.toWei(gasPrice, "gwei")))
                .toString(),
            "ether"
        );

        console.log(`Executed! (${mintCost} eth at ${gasPrice} gwei)`);
    } catch (err: any) {
        console.log(err.message);
    }
}

export async function executeDaoProcess(
    targets: string[],
    values: number[],
    proposalCallData: any[],
    proposalDescription: string,
    proposerSenator: any,
    _senators: any[],
    finalResult: number,
    governor: LilyPadGovernor,
    votingDelay: number,
    votingPeriod: number,
    executorMinDelay: number
): Promise<BigNumber> {
    let votesInFavor = _senators.length * 0.51; //51% of votes
    let votesAgainst = _senators.length * 0.25; //25% of votes

    if (finalResult == 0) {
        votesInFavor = _senators.length * 0.45; //45% of votes
        votesAgainst = _senators.length * 0.5; //50% of votes
    }

    //propose
    const propId = await propose(
        targets,
        values,
        proposalCallData,
        proposerSenator,
        proposalDescription,
        governor!!
    );

    //mine voting delay
    console.log(`Mining ${votingDelay + 1} blocks for voting delay...`);
    await chainMine(votingDelay + 1);

    console.log(
        `******************************************** Voting ************************************************`
    );
    let voteCounter = 0;

    for (const senator of _senators) {
        voteCounter++;
        let voteOpt = 1;
        let voteDesc = "is in favor";

        if (voteCounter > votesInFavor + votesAgainst) {
            voteOpt = 2;
            voteDesc = "abstained";
        } else if (voteCounter > votesInFavor) {
            voteOpt = 0;
            voteDesc = "is against";
        }

        const minterVotingPower = Number(
            await governor.getVotes(senator.address, await governor.proposalSnapshot(propId!!))
        );

        let voteResult = await vote(senator, propId, voteOpt, "", governor);
    }

    const {
        id,
        proposer,
        eta,
        startBlock,
        endBlock,
        forVotes,
        againstVotes,
        abstainVotes,
        canceled,
        executed,
    } = await governor.proposals(propId);

    console.log(`In Favor: ${forVotes}`);
    console.log(`Against: ${againstVotes}`);
    console.log(`Abstained: ${abstainVotes}`);

    console.log(
        `****************************************************************************************************`
    );

    //mine voting period and try to queue
    console.log(`Mining ${votingPeriod + 1} blocks for voting period...`);
    await chainMine(votingPeriod + 1);

    console.log(
        `************************************** Queue and Executed ******************************************`
    );

    const schedulePropId = await queue(
        _senators[0],
        targets,
        values,
        proposalCallData,
        proposalDescription,
        governor!!
    );

    console.log(`Sleeping ${executorMinDelay + 1} miliseconds for execution min delay...`);

    await chainSleep(executorMinDelay + 1);
    await chainMine(1);

    await execute(_senators[0], targets, values, proposalCallData, proposalDescription, governor!!);

    console.log(
        `****************************************************************************************************`
    );

    return propId!!;
}

export enum proposalStatesEnum {
    Pending = 0,
    Active = 1,
    Canceled = 2,
    Defeated = 3,
    Succeeded = 4,
    Queued = 5,
    Expired = 6,
    Executed = 7,
}
