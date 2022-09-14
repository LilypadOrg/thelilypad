import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { z } from 'zod';

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
  .query('bySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      try {
        const tag = await prisma.courseLevel.findUnique({
          where: { slug: input.slug },
          select: defaultLevelsSelect,
        });
        return tag;
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
