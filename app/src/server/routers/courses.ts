import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { ContentType } from '~/types/types';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';

const defaultCourseSelect = Prisma.validator<Prisma.ContentSelect>()({
  id: true,
  title: true,
  description: true,
  coverImageUrl: true,
  technologies: true,
  tags: true,
  slug: true,
  course: {
    select: {
      id: true,
      levels: true,
      xp: true,
      userCourses: true,
    },
  },
});

export const courseRouter = createRouter()
  // read
  .query('all', {
    input: z
      .object({
        tags: z.array(z.string()).or(z.string()).optional(),
        technologies: z.array(z.string()).or(z.string()).optional(),
        levels: z.array(z.string()).or(z.string()).optional(),
        take: z.number().min(1).max(100).optional(),
      })
      .optional(),
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      try {
        const courses = await prisma.content.findMany({
          where: {
            contentType: { name: ContentType.COURSE },
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
            ...(input?.levels
              ? { course: { levels: { some: { slug: { in: input.levels } } } } }
              : {}),
          },
          take: input?.take || BROWSE_COURSES_ITEMS,
          select: defaultCourseSelect,
        });
        return courses;
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
        levels: z.array(z.string()).or(z.string()).optional(),
      })
      .optional(),
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */
      try {
        const courses = await prisma.content.findMany({
          where:
            input?.tags || input?.technologies || input?.levels
              ? {
                  contentType: { name: ContentType.COURSE },
                  OR: [
                    {
                      ...(input?.tags
                        ? {
                            tags: { some: { slug: { in: input.tags } } },
                          }
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
                    {
                      ...(input?.levels
                        ? {
                            course: {
                              levels: { some: { slug: { in: input.levels } } },
                            },
                          }
                        : {}),
                    },
                  ],
                }
              : {
                  contentType: { name: ContentType.COURSE },
                },
          select: defaultCourseSelect,
        });
        return courses;
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
        const course = await prisma.content.findFirst({
          where: { id, contentType: { name: ContentType.COURSE } },
          select: defaultCourseSelect,
        });

        if (!course) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No course with id '${id}'`,
          });
        }
        return course;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
