import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import {
  BIO_MAX_LENGTH,
  BIO_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '~/utils/constants';

const profileUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  bio: true,
  address: true,
  xp: true,
  level: true,
  technologies: true,
  courses: {
    select: {
      completed: true,
      roadmap: true,
      courseId: true,
      // course: {
      //   select: {
      //     id: true,
      //     content: true,
      //     levels: {
      //       select: {
      //         name: true,
      //       },
      //     },
      //   },
      // },
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
          where: { username: input.username },
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
  .mutation('updateProfile', {
    input: z.object({
      username: z.string().min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH),
      bio: z.string().min(BIO_MIN_LENGTH).max(BIO_MAX_LENGTH),
      technologies: z.number().array(),
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
          data: {
            username: input.username,
            bio: input.bio,
            technologies: {
              set: [],
              connect: input.technologies.map((id) => ({
                id,
              })),
            },
          },
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
          where: { userCourses: { some: { completed: true, userId } } },
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
