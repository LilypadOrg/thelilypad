import { Prisma } from '@prisma/client';
import { ContentType } from '~/types/types';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

const defaultTechnologiesSelect = Prisma.validator<Prisma.TechnologySelect>()({
  id: true,
  name: true,
  slug: true,
});

export const technologyRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const techs = await ctx.prisma.technology.findMany({
      select: defaultTechnologiesSelect,
    });
    return techs;
  }),

  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const tech = await ctx.prisma.technology.findUnique({
        where: { slug: input.slug },
        select: defaultTechnologiesSelect,
      });
      return tech;
    }),

  byContentTYpe: publicProcedure
    .input(
      z.object({
        contentType: z.nativeEnum(ContentType),
        tags: z.string().array().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const techs = await ctx.prisma.technology.findMany({
        where: {
          contents: {
            some: { contentType: { name: input.contentType } },
          },
        },
        select: {
          ...defaultTechnologiesSelect,
          _count: {
            select: {
              contents: {
                where: {
                  contentType: { name: input.contentType },
                  ...(input.tags
                    ? { tags: { some: { name: { in: input.tags } } } }
                    : {}),
                },
              },
            },
          },
        },
      });
      return techs;
    }),
});
