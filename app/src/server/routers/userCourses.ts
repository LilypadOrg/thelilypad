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
});

export const userCourseRouter = createRouter()
  .query('all', {
    input: z.object({
      userId: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { userId } = input;

      try {
        const userCourse = await prisma.userCourse.findMany({
          where: { userId_courseId },
          select: singleUserCourseSelect,
        });
        if (!userCourse) {
          return {
            userId,
            courseId,
            enrolled: false,
            completed: false,
            completedOn: null,
          };
        }
        return userCourse;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving course status`,
        });
      }
    },
  })
  .query('status', {
    input: z.object({
      userId: z.number(),
      courseId: z.number(),
    }),
    async resolve({ input, ctx }) {
      const { courseId, userId } = input;
      if (!ctx.session?.user || ctx.session?.user.userId !== userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const userCourse = await prisma.userCourse.findUnique({
          where: { userId_courseId: { userId, courseId } },
          select: singleUserCourseSelect,
        });
        if (!userCourse) {
          return {
            userId,
            courseId,
            enrolled: false,
            completed: false,
            completedOn: null,
          };
        }
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
      completed: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const { courseId, completed } = input;
        const { userId } = ctx.session.user;

        const userCourse = await prisma.userCourse.upsert({
          where: {
            userId_courseId: { userId, courseId },
          },
          update: {
            completed,
            completedOn: new Date(),
          },
          create: {
            userId,
            courseId,
            completed,
            completedOn: new Date(),
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
  });
