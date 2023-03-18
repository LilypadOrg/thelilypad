import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

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
      accolades: {
        select: {
          id: true,
          description: true,
          imageUrl: true,
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
          url: true,
        },
      },
      userCourses: {
        select: {
          roadmap: true,
          completed: true,
          completedOn: true,
          lastTestPassed: true,
        },
      },
    },
  },
});

export const userCourseRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { username } = input;

      const userCourse = await ctx.prisma.userCourse.findMany({
        where: { user: { username } },
        select: defaultUserCourseSelect,
      });

      return userCourse;
    }),

  single: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { courseId } = input;

      const userId = ctx.session.user.userId;
      const userCourse = await ctx.prisma.userCourse.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: singleUserCourseSelect,
      });
      return userCourse;
    }),

  addToRoadmap: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        roadmap: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { courseId, roadmap } = input;
      const { userId } = ctx.session.user;
      const userCourse = await ctx.prisma.userCourse.upsert({
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
    }),

  complete: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { courseId } = input;
      const { userId } = ctx.session.user;

      const curLevel = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { level: true },
      });

      const userCourseId = await ctx.prisma.userCourse.findFirstOrThrow({
        where: {
          lastTestPassed: true,
          userId,
          courseId,
        },
        select: { id: true },
      });

      await ctx.prisma.userCourse.update({
        where: {
          id: userCourseId.id,
        },
        data: {
          completed: true,
          completedOn: new Date(),
        },
        select: singleUserCourseSelect,
      });

      const xp = await ctx.prisma.course.aggregate({
        _sum: { xp: true },
        where: { userCourses: { some: { completed: true, userId } } },
      });

      const xpVal = xp._sum.xp || 0;
      const level = await ctx.prisma.userLevel.findFirst({
        where: { AND: { xpFrom: { lte: xpVal }, xpTo: { gte: xpVal } } },
      });

      if (!level) throw new Error();
      const user = await ctx.prisma.user.update({
        where: { id: userId },
        data: { xp: xpVal, levelNumber: level.number },
      });

      return { levelUp: curLevel.level.number !== level.number, user: user };
    }),
});
