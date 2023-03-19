import { Prisma } from '@prisma/client';
import { z } from 'zod';
import {
  BIO_MAX_LENGTH,
  BIO_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '~/utils/constants';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const profileUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  bio: true,
  address: true,
  xp: true,
  level: true,
  technologies: true,
  hasPondSBT: true,
  hasOnChainProfile: true,
  courses: {
    select: {
      completed: true,
      roadmap: true,
      courseId: true,
    },
  },
});

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  bio: true,
  address: true,
  xp: true,
  level: true,
  technologies: true,
  hasPondSBT: true,
  hasOnChainProfile: true,
});

export const userRouter = createTRPCRouter({
  byUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
        select: profileUserSelect,
      });
      return user;
    }),

  byAddress: publicProcedure
    .input(
      z.object({
        address: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.prisma.user.findUnique({
        where: { address: input.address },
        select: defaultUserSelect,
      });
      return user;
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        username: z.string().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH),
        bio: z.string().min(BIO_MIN_LENGTH).max(BIO_MAX_LENGTH),
        technologies: z.number().array(),
        hasOnChainProfile: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.session.user;

      const user = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          username: input.username,
          bio: input.bio,
          technologies: {
            set: [],
            connect: input.technologies.map((id) => ({
              id,
            })),
          },
          hasOnChainProfile: input.hasOnChainProfile,
        },
      });
      return user;
    }),

  setHasPondSbt: protectedProcedure
    .input(
      z.object({
        hasPondSBT: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.session.user;

      const user = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          hasPondSBT: input.hasPondSBT,
        },
        select: defaultUserSelect,
      });
      return user;
    }),
});
