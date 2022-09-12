import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '~/utils/constants';

const profileUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  address: true,
  xp: true,
  level: true,
  courses: {
    select: {
      completed: true,
      enrolled: true,
      course: {
        select: {
          id: true,
          content: true,
        },
      },
    },
  },
});

export const userRouter = createRouter()
  .query('byUsername', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input }) {
      try {
        const user = prisma.user.findUnique({
          where: { name: input.username },
          select: profileUserSelect,
        });
        return user;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong'`,
        });
      }
    },
  })
  .query('byAddress', {
    input: z.object({
      address: z.string(),
    }),
    async resolve({ input }) {
      try {
        const user = prisma.user.findUnique({
          where: { address: input.address },
          select: profileUserSelect,
        });
        return user;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong'`,
        });
      }
    },
  })
  .mutation('updateUsername', {
    input: z.object({
      username: z.string().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const { userId } = ctx.session.user;

        const user = await prisma.user.update({
          where: { id: userId },
          data: { name: input.username },
        });
        return user;
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong'`,
        });
      }
    },
  })
  .mutation('updateXPandLevel', {
    async resolve({ ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const { userId } = ctx.session.user;
        const xp = await prisma.course.aggregate({
          _sum: { xp: true },
          where: { users: { some: { completed: true, userId } } },
        });

        const xpVal = xp._sum.xp || 0;
        const level = await prisma.userLevel.findFirst({
          where: { AND: { xpFrom: { lte: xpVal }, xpTo: { gte: xpVal } } },
        });

        if (!level) throw new Error();
        const user = await prisma.user.update({
          where: { id: userId },
          data: { xp: xpVal, levelNumber: level.number },
        });
        return user;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong'`,
        });
      }
    },
  });
