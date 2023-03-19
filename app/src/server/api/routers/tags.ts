import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { ContentType } from '~/types/types';
import { createTRPCRouter, publicProcedure } from '../trpc';

const defaultTagsSelect = Prisma.validator<Prisma.TagSelect>()({
  id: true,
  name: true,
  slug: true,
});

export const tagRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z
        .object({
          tags: z.array(z.string()).or(z.string()).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const tags = await ctx.prisma.tag.findMany({
        where: { ...(input?.tags ? { slug: { in: input.tags } } : {}) },
        select: {
          ...defaultTagsSelect,
          _count: {
            select: { contents: true },
          },
        },
      });
      return tags;
    }),

  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const tag = await ctx.prisma.tag.findUnique({
        where: { slug: input.slug },
        select: defaultTagsSelect,
      });
      return tag;
    }),

  byContentTYpe: publicProcedure
    .input(
      z.object({
        contentType: z.nativeEnum(ContentType),
      })
    )
    .query(async ({ input, ctx }) => {
      const tags = await ctx.prisma.tag.findMany({
        where: {
          contents: { some: { contentType: { name: input.contentType } } },
        },
        select: {
          ...defaultTagsSelect,
          _count: {
            select: {
              contents: {
                where: { contentType: { name: input.contentType } },
              },
            },
          },
        },
      });
      return tags;
    }),
});
