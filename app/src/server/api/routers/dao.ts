import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { BROWSE_DAO_ITEMS } from '~/utils/constants';
import { createTRPCRouter, publicProcedure } from '../trpc';

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

export const daoRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z
        .object({
          take: z.number().min(1).max(100).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const proposals = await ctx.prisma.daoProposal.findMany({
        take: input?.take || BROWSE_DAO_ITEMS,
        select: defaultDaoProposalSelect,
      });

      return proposals;
    }),

  list: publicProcedure
    .input(
      z
        .object({
          skip: z.number().optional(),
          take: z.number().min(1).max(100).optional(),
          cursorId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const proposals = await ctx.prisma.daoProposal.findMany({
        skip: input?.skip || 0,
        take: input?.take || BROWSE_DAO_ITEMS,

        select: defaultDaoProposalSelect, //listDaoProposalSelect,
      });
      return proposals;
    }),

  count: publicProcedure
    .input(
      z
        .object({
          status: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const proposalQtty = await ctx.prisma.daoProposal.count({
        where: { ...(input?.status ? { status: input?.status } : {}) },
      });
      return proposalQtty;
    }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const proposal = await ctx.prisma.daoProposal.findUnique({
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
    }),

  byProposalId: publicProcedure
    .input(
      z.object({
        proposalId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { proposalId } = input;
      const proposal = await ctx.prisma.daoProposal.findUnique({
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
    }),
});
