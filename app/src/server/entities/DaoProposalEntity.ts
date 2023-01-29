import { DaoProposal, DaoProposalVote } from '@prisma/client';
import { proposalStatesEnum, voteSupportEnum } from '~/types/enums';
import ProposalJson from '~/types/types';

export interface DaoProposalModel {
  id?: number;
  proposalId?: string;
  proposer?: string;
  proposerUrl?: string;
  title?: string;
  summary?: string;
  description?: string;
  targets?: string[];
  values?: string[];
  signatures?: string[];
  calldatas?: string[];
  functionId?: number[];
  contractFunctions?: string[];
  parameters?: string[];
  status?: number;
  statusDesc?: string;
  proposalTimeStamp?: string;
  proposalBlock?: string;
  snapshotBlock?: string;
  startBlock?: number;
  endBlock?: number;
  votesInFavor?: number;
  votesAgainst?: number;
  votesAbstained?: number;
  daoVotes?: DaoVoteModel[];
  tx?: string;
  txUrl?: string;
  eta?: number;
}

export interface DaoVoteModel {
  id?: number;
  proposalId?: string;
  voter?: string;
  support?: number;
  supportDesc?: string;
  weight?: number;
  reason?: string;
  tx?: string;
}

export class DaoProposalEntity {
  static parse(
    data?: DaoProposal,
    dataVotes?: DaoProposalVote[]
  ): DaoProposalModel {
    const proposalModel: DaoProposalModel = {};

    if (data) {
      proposalModel.id = data.id;
      proposalModel.proposalId = data.proposalId ?? undefined;
      proposalModel.title = data.description;
      proposalModel.proposer = data.proposer;

      proposalModel.proposerUrl =
        process.env.NODE_ENV == 'production'
          ? `https://polygonscan.com/address/${data.proposer}`
          : `https://mumbai.polygonscan.com/address/${data.proposer}`;

      proposalModel.tx = data.tx ?? '';

      proposalModel.txUrl =
        process.env.NODE_ENV == 'production'
          ? `https://polygonscan.com/tx/${data.tx}`
          : `https://mumbai.polygonscan.com/tx/${data.tx}`;

      var voteInFavorWeight = 0;
      var voteAgainstWeight = 0;
      var abstainedWeight = 0;

      if (dataVotes) {
        for (const v of dataVotes.filter(
          (v) => v.support == voteSupportEnum.InFavor
        )) {
          voteInFavorWeight += v?.weigth ?? 0;
        }

        for (const v of dataVotes.filter(
          (v) => v.support == voteSupportEnum.Against
        )) {
          voteAgainstWeight += v?.weigth ?? 0;
        }
        for (const v of dataVotes.filter(
          (v) => v.support == voteSupportEnum.Abstained
        )) {
          abstainedWeight += v?.weigth ?? 0;
        }
      }

      //parse json with proposal content
      const jsonFile: ProposalJson = JSON.parse(data.proposalJson);
      proposalModel.summary = jsonFile.summary;
      proposalModel.title = jsonFile.title;
      proposalModel.description = jsonFile.title;
      proposalModel.contractFunctions = jsonFile.contractFunctions;
      proposalModel.proposalTimeStamp = jsonFile.proposalTimeStamp;
      proposalModel.proposalBlock = jsonFile.proposalBlock;
      proposalModel.votesInFavor = voteInFavorWeight;
      proposalModel.votesAgainst = voteAgainstWeight;
      proposalModel.votesAbstained = abstainedWeight;

      proposalModel.status = data.status ?? -1;
      proposalModel.statusDesc = proposalStatesEnum[data.status ?? -1];

      //proposalModel.daoVotes = Array.isArray(proposalModel.daoVotes) ? proposalModel.daoVotes!! : [proposalModel.daoVotes!!];
      proposalModel.eta = proposalModel.endBlock = 1;
    }
    return proposalModel;
  }
}
