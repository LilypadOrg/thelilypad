import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const defaultTagsSelect = Prisma.validator<Prisma.TagSelect>()({
  id: true,
  name: true,
  slug: true,
});

export const tagRouter = createRouter()
  // read
  .query('all', {
    async resolve() {
      try {
        const tags = await prisma.tag.findMany({
          select: defaultTagsSelect,
        });
        return tags;
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
        const tags = await prisma.tag.findMany({
          where: { courses: { some: {} } },
          select: defaultTagsSelect,
        });
        return tags;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('forResources', {
    async resolve() {
      try {
        const tags = await prisma.tag.findMany({
          where: { resources: { some: {} } },
          select: defaultTagsSelect,
        });
        return tags;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
