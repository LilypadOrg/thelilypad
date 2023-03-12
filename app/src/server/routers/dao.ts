import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { BROWSE_DAO_ITEMS } from '~/utils/constants';

const defaultDaoProposalSelect = Prisma.validator<Prisma.DaoProposalSelect>()({
  id: true,
  proposer: true,
  targets: true,
  signatures: true,
  values: true,
  calldatas: true,
  startBlock: true,
  endBlock: true,
  description: true,
  proposalJson: true,
  status: true,
  proposalId: true,
  eta: true,
  params: true,
  tx: true,
  functionId: true,
  snapshotBlock: true,
  //function: {
  //  select: {
  //    contractAddress: true,
  //    contractFunction: true,
  //    functionInputs: true,
  //    functionName: true,
  //  },
  //},
  votes: {
    select: {
      id: true,
      voter: true,
      support: true,
      weigth: true,
      reason: true,
      voteTx: true,
      proposalId: true,
    },
  },
});

export const daoRouter = createRouter()
  // read
  .query('all', {
    input: z
      .object({
        take: z.number().min(1).max(100).optional(),
      })
      .optional(),
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */
      try {
        const proposals = await prisma.daoProposal.findMany({
          take: input?.take || BROWSE_DAO_ITEMS,
          select: defaultDaoProposalSelect,
        });

        return proposals;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('list', {
    input: z
      .object({
        skip: z.number().optional(),
        take: z.number().min(1).max(100).optional(),
        cursorId: z.number().optional(),
      })
      .optional(),
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */
      try {
        const proposals = await prisma.daoProposal.findMany({
          skip: input?.skip || 0,
          take: input?.take || BROWSE_DAO_ITEMS,
          //cursor: {
          //  id: input?.cursorId ? input?.cursorId : 1,
          //},
          select: defaultDaoProposalSelect, //listDaoProposalSelect,
        });
        return proposals;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('count', {
    input: z
      .object({
        status: z.number().optional(),
      })
      .optional(),
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      try {
        const proposalQtty = await prisma.daoProposal.count({
          where: { ...(input?.status ? { status: input?.status } : {}) },
        });
        return proposalQtty;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      try {
        const { id } = input;

        const proposal = await prisma.daoProposal.findUnique({
          where: { id: id },
          select: defaultDaoProposalSelect,
        });
        if (!proposal) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No proposal with id '${id}'`,
          });
        }
        return proposal;
      } catch (err) {
        err;
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data. Error: ${err}`,
        });
      }
    },
  })
  .query('byProposalId', {
    input: z.object({
      proposalId: z.number(),
    }),
    async resolve({ input }) {
      try {
        const { proposalId } = input;
        const proposal = await prisma.daoProposal.findUnique({
          where: { proposalId: proposalId.toString() },
          select: defaultDaoProposalSelect,
        });

        if (!proposal) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No proposal with id '${proposalId}'`,
          });
        }
        return proposal;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
