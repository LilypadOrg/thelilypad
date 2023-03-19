import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

const defaultLevelsSelect = Prisma.validator<Prisma.LevelSelect>()({
  id: true,
  name: true,
  slug: true,
});

export const levelRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const levels = await ctx.prisma.level.findMany({
      select: defaultLevelsSelect,
    });
    return levels;
  }),

  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const slug = await ctx.prisma.level.findUnique({
        where: { slug: input.slug },
        select: defaultLevelsSelect,
      });
      return slug;
    }),

  byContentTYpe: publicProcedure.query(async ({ ctx }) => {
    const levels = await ctx.prisma.level.findMany({
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
  }),
});
