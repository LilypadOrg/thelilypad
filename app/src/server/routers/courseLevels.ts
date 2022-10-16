import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { ContentType } from '~/types/types';

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
  .query('byContentTYpe', {
    input: z.object({
      contentType: z.nativeEnum(ContentType),
      levels: z.string().array().optional(),
    }),
    async resolve({ input }) {
      try {
        const levels = await prisma.courseLevel.findMany({
          where: {
            courses: {
              some: {},
            },
          },
          select: {
            ...defaultLevelsSelect,
            _count: {
              select: { courses: true },
            },
          },
        });
        return levels.map((l) => ({
          ...l,
          _count: { contents: l._count.courses },
        }));
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
