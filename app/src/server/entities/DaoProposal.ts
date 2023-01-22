import { DaoProposal } from '@prisma/client';
import { proposalStatesEnum } from '~/types/enums';
import ProposalJson from '~/types/types';

export interface DaoProposalModel {
  id?: number;
  proposalId?: string;
  proposer?: string;
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
  static parse(data: DaoProposal): DaoProposalModel {
    const proposalModel: DaoProposalModel = {};

    if (data) {
      proposalModel.id = data.id;
      proposalModel.proposalId = data.proposalId ?? undefined;
      proposalModel.title = data.description;

      const voteInFavorWeight = 0;
      const voteAgainstWeight = 0;
      const abstainedWeight = 0;
      /*if (Array.isArray(proposalModel.daoVotes)) {
        for (const v of proposalModel.daoVotes.filter(
          (v) => v.support == voteSupportEnum.InFavor
        )) {
          voteInFavorWeight += v?.weight ?? 0;
        }
      } //else voteInFavorWeight += proposalModel.daoVotes ?? 0;

      if (Array.isArray(data.votes)) {
        for (const v of proposalModel.daoVotes.filter(
          (v) => v.support == voteSupportEnum.Against
        )) {
          voteAgainstWeight += v?.weight ?? 0;
        }
      } //else voteAgainstWeight += proposalModel.daoVotes.weight;

      if (Array.isArray(proposalModel.daoVotes)) {
        for (const v of proposalModel.daoVotes.filter(
          (v) => v.support == voteSupportEnum.Abstained
        )) {
          abstainedWeight += v?.weight ?? 0;
        }
      } //else abstainedWeight += proposalModel.daoVotes.weight;
*/
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
