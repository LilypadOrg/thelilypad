import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const profileUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  address: true,
  xp: true,
  level: true,
  courses: {
    select: {
      completed: true,
      enrolled: true,
      course: true,
    },
  },
});

export const userRouter = createRouter()
  .query('profile', {
    async resolve({ ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const { userId } = ctx.session.user;
        const user = prisma.user.findUnique({
          where: { id: userId },
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
