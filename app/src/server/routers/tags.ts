import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { z } from 'zod';
import { ContentType } from '~/types/types';

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
          select: {
            ...defaultTagsSelect,
            _count: {
              select: { contents: true },
            },
          },
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
  .query('byContentTYpe', {
    input: z.object({
      contentType: z.nativeEnum(ContentType),
    }),
    async resolve({ input }) {
      try {
        const tags = await prisma.tag.findMany({
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
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
