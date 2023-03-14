import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ContentType } from '~/types/types';
import { createTRPCRouter, publicProcedure } from '../trpc';

const defaultResourceSelect = Prisma.validator<Prisma.ContentSelect>()({
  id: true,
  title: true,
  description: true,
  url: true,
  coverImageUrl: true,
  technologies: true,
  tags: true,
  slug: true,
});

export const resourceRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z
        .object({
          tags: z.array(z.string()).or(z.string()).optional(),
          technologies: z.array(z.string()).or(z.string()).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const resources = await ctx.prisma.content.findMany({
        where: {
          contentType: { name: ContentType.RESOURCE },
          ...(input?.tags
            ? { tags: { some: { slug: { in: input.tags } } } }
            : {}),

          ...(input?.technologies
            ? {
                technologies: {
                  some: { slug: { in: input.technologies } },
                },
              }
            : {}),
        },
        select: defaultResourceSelect,
      });
      return resources;
    }),

  related: publicProcedure
    .input(
      z
        .object({
          tags: z.array(z.string()).or(z.string()).optional(),
          technologies: z.array(z.string()).or(z.string()).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const resources = await ctx.prisma.content.findMany({
        where:
          input?.tags || !input?.technologies
            ? {
                contentType: { name: ContentType.RESOURCE },
                OR: [
                  {
                    ...(input?.tags
                      ? { tags: { some: { slug: { in: input.tags } } } }
                      : {}),
                  },
                  {
                    ...(input?.technologies
                      ? {
                          technologies: {
                            some: { slug: { in: input.technologies } },
                          },
                        }
                      : {}),
                  },
                ],
              }
            : {
                contentType: { name: ContentType.RESOURCE },
              },
        select: defaultResourceSelect,
      });
      return resources;
    }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const resource = await ctx.prisma.content.findUnique({
        where: { id },
        select: defaultResourceSelect,
      });

      if (!resource) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No course with id '${id}'`,
        });
      }
      return resource;
    }),
});
