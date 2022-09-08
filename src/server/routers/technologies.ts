import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const defaultTechnologiesSelect = Prisma.validator<Prisma.TechnologySelect>()({
  id: true,
  name: true,
  slug: true,
});

export const technologyRouter = createRouter()
  // read
  .query('all', {
    async resolve() {
      try {
        const techs = await prisma.technology.findMany({
          select: defaultTechnologiesSelect,
        });
        return techs;
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
        const techs = await prisma.technology.findMany({
          where: { courses: { some: {} } },
          select: defaultTechnologiesSelect,
        });
        return techs;
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
        const techs = await prisma.technology.findMany({
          where: { resources: { some: {} } },
          select: defaultTechnologiesSelect,
        });
        return techs;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
