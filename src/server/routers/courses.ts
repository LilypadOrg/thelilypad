import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const defaultCourseSelect = Prisma.validator<Prisma.CourseSelect>()({
  id: true,
  title: true,
  description: true,
  coverImageUrl: true,
  technologies: true,
  levels: true,
  xp: true,
  tags: true,
  slug: true,
});

export const courseRouter = createRouter()
  // read
  .query('all', {
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
        const courses = await prisma.course.findMany({
          where: {
            ...(input?.tags
              ? { tags: { some: { slug: { in: input.tags } } } }
              : {}),
            ...(input?.technologies
              ? { technologies: { some: { slug: { in: input.technologies } } } }
              : {}),
            ...(input?.levels
              ? { levels: { some: { slug: { in: input.levels } } } }
              : {}),
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
        const courses = await prisma.course.findMany({
          where:
            input?.tags || input?.technologies || input?.levels
              ? {
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
                    {
                      ...(input?.levels
                        ? { levels: { some: { slug: { in: input.levels } } } }
                        : {}),
                    },
                  ],
                }
              : undefined,
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
        const course = await prisma.course.findUnique({
          where: { id },
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
