import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { ContentType } from '~/types/types';

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

export const resourceRouter = createRouter()
  // read
  .query('all', {
    input: z
      .object({
        tags: z.array(z.string()).or(z.string()).optional(),
        technologies: z.array(z.string()).or(z.string()).optional(),
      })
      .optional(),
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */
      try {
        const resources = await prisma.content.findMany({
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
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('related', {
    input: z
      .object({
        tags: z.array(z.string()).or(z.string()).optional(),
        technologies: z.array(z.string()).or(z.string()).optional(),
      })
      .optional(),
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */
      try {
        const resources = await prisma.content.findMany({
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
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      try {
        const { id } = input;
        const resource = await prisma.content.findUnique({
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
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
