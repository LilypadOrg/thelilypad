import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const defaultLevelsSelect = Prisma.validator<Prisma.CourseLevelSelect>()({
  id: true,
  name: true,
  slug: true,
});

export const courseLevelRouter = createRouter()
  // read
  .query('all', {
    async resolve() {
      try {
        const courseLevels = await prisma.courseLevel.findMany({
          select: defaultLevelsSelect,
        });
        return courseLevels;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('forCourses', {
    async resolve() {
      try {
        const courseLevels = await prisma.courseLevel.findMany({
          where: { courses: { some: {} } },
          select: defaultLevelsSelect,
        });
        return courseLevels;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
