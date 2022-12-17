import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const singleUserCourseSelect = Prisma.validator<Prisma.UserCourseSelect>()({
  userId: true,
  courseId: true,
  roadmap: true,
  completed: true,
  completedOn: true,
  lastTestOn: true,
  lastTestPassed: true,
});

const defaultUserCourseSelect = Prisma.validator<Prisma.UserCourseSelect>()({
  userId: true,
  courseId: true,
  roadmap: true,
  completed: true,
  completedOn: true,
  lastTestOn: true,
  lastTestPassed: true,
  course: {
    select: {
      id: true,
      levels: true,
      xp: true,
      accolades: true,
      userCourses: {
        select: {
          roadmap: true,
          completed: true,
          completedOn: true,
          lastTestPassed: true,
        },
      },
      content: {
        select: {
          id: true,
          title: true,
          description: true,
          coverImageUrl: true,
          technologies: true,
          tags: true,
          slug: true,
        },
      },
    },
  },
});

export const userCourseRouter = createRouter()
  // TODO: Update to query course table as main object instead usercourses
  .query('all', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input }) {
      const { username } = input;

      try {
        const userCourse = await prisma.userCourse.findMany({
          where: { user: { username } },
          select: defaultUserCourseSelect,
        });

        return userCourse;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving course status`,
        });
      }
    },
  })
  .query('single', {
    input: z.object({
      courseId: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { courseId } = input;
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const userId = ctx.session.user.userId;
        const userCourse = await prisma.userCourse.findUnique({
          where: { userId_courseId: { userId, courseId } },
          select: singleUserCourseSelect,
        });
        return userCourse;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving course status`,
        });
      }
    },
  })
  .query('singleWithContent', {
    input: z.object({
      courseId: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { courseId } = input;
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const userId = ctx.session.user.userId;
        const userCourse = await prisma.userCourse.findUnique({
          where: { userId_courseId: { userId, courseId } },
          select: defaultUserCourseSelect,
        });
        return userCourse;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving course status`,
        });
      }
    },
  })
  .mutation('addToRoadmap', {
    input: z.object({
      courseId: z.number(),
      roadmap: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const { courseId, roadmap } = input;
        const { userId } = ctx.session.user;
        const userCourse = await prisma.userCourse.upsert({
          where: {
            userId_courseId: { userId, courseId },
          },
          update: {
            roadmap,
          },
          create: {
            userId,
            courseId,
            roadmap,
          },
          select: singleUserCourseSelect,
        });
        return userCourse;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error updating course status`,
        });
      }
    },
  })
  .mutation('complete', {
    input: z.object({
      courseId: z.number(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const { courseId } = input;
        const { userId } = ctx.session.user;

        const curLevel = await prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: { level: true },
        });

        const userCourseId = await prisma.userCourse.findFirstOrThrow({
          where: {
            lastTestPassed: true,
            userId,
            courseId,
          },
          select: { id: true },
        });

        await prisma.userCourse.update({
          where: {
            id: userCourseId.id,
          },
          data: {
            completed: true,
            completedOn: new Date(),
          },
          select: singleUserCourseSelect,
        });

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

        return { levelUp: curLevel.level.number !== level.number, user: user };
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error updating course status`,
        });
      }
    },
  });
