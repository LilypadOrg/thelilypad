import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const singleUserCourseSelect = Prisma.validator<Prisma.UserCourseSelect>()({
  userId: true,
  courseId: true,
  enrolled: true,
  completed: true,
  completedOn: true,
});

export const userCourseRouter = createRouter()
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
  .mutation('enroll', {
    input: z.object({
      courseId: z.number(),
      enrolled: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const { courseId, enrolled } = input;
        const { userId } = ctx.session.user;
        const userCourse = await prisma.userCourse.upsert({
          where: {
            userId_courseId: { userId, courseId },
          },
          update: {
            enrolled,
          },
          create: {
            userId,
            courseId,
            enrolled,
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
