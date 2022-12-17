import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { ContentType } from '~/types/types';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';

const defaultCourseSelect = Prisma.validator<Prisma.CourseSelect>()({
  id: true,
  levels: true,
  xp: true,
  content: {
    select: {
      id: true,
      title: true,
      description: true,
      coverImageUrl: true,
      technologies: true,
      tags: true,
      slug: true,
    },
  },
  userCourses: {
    select: {
      roadmap: true,
      completed: true,
      completedOn: true,
      lastTestPassed: true,
    },
  },
});

const userCourseSelect = Prisma.validator<Prisma.CourseSelect>()({
  id: true,
  levels: true,
  xp: true,
  accolades: {
    select: {
      id: true,
      description: true,
      imageUrl: true,
    },
  },
  userCourses: {
    select: {
      roadmap: true,
      completed: true,
      completedOn: true,
      lastTestPassed: true,
    },
  },
  content: {
    select: {
      id: true,
      title: true,
      description: true,
      coverImageUrl: true,
      technologies: true,
      tags: true,
      slug: true,
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
    async resolve({ ctx, input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      try {
        const userId = ctx.session?.user.userId || -1;
        const courses = await prisma.course.findMany({
          where: {
            ...(input?.tags
              ? { content: { tags: { some: { slug: { in: input.tags } } } } }
              : {}),
            ...(input?.technologies
              ? {
                  content: {
                    technologies: {
                      some: { slug: { in: input.technologies } },
                    },
                  },
                }
              : {}),
            ...(input?.levels
              ? { levels: { some: { slug: { in: input.levels } } } }
              : {}),
          },
          take: input?.take || BROWSE_COURSES_ITEMS,
          select: {
            ...defaultCourseSelect,
            userCourses: {
              ...userCourseSelect.userCourses,
              where: { userId: userId || -1 },
            },
          },
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
    input: z.object({
      tags: z.array(z.string()).or(z.string()).optional(),
      technologies: z.array(z.string()).or(z.string()).optional(),
      excludeCourseId: z.number().optional(),
    }),
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */
      try {
        const courses = await prisma.course.findMany({
          where: {
            ...(input.excludeCourseId
              ? { id: { not: input.excludeCourseId } }
              : {}),
            ...(input.tags || input.technologies
              ? {
                  OR: [
                    {
                      ...(input?.tags
                        ? {
                            content: {
                              tags: { some: { slug: { in: input.tags } } },
                            },
                          }
                        : {}),
                    },
                    {
                      ...(input?.technologies
                        ? {
                            content: {
                              technologies: {
                                some: { slug: { in: input.technologies } },
                              },
                            },
                          }
                        : {}),
                    },
                  ],
                }
              : {}),

            //   content: {
            //     OR: [
            //       {
            // ...(input?.tags
            //   ? {
            //       tags: { some: { slug: { in: input.tags } } },
            //     }
            //   : {}),
            //       },
            // {
            //   ...(input?.technologies
            //     ? {
            //         technologies: {
            //           some: { slug: { in: input.technologies } },
            //         },
            //       }
            //     : {}),
            // },
            //       {
            //         ...(input?.levels
            //           ? {
            //               course: {
            //                 levels: {
            //                   some: { slug: { in: input.levels } },
            //                 },
            //               },
            //             }
            //           : {}),
            //       },
            //     ],
            //   },
            // }
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
    async resolve({ ctx, input }) {
      try {
        const userId = ctx.session?.user.userId;
        const { id } = input;
        const course = await prisma.course.findUnique({
          where: { id },
          select: {
            ...defaultCourseSelect,
            userCourses: {
              ...userCourseSelect.userCourses,
              where: { userId: userId || -1 },
            },
          },
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
  })
  .query('byUsername', {
    input: z.object({
      username: z.string(),
      completed: z.boolean().optional(),
    }),
    async resolve({ input }) {
      try {
        const completed = !!input.completed;
        const course = await prisma.course.findMany({
          where: {
            userCourses: { some: { user: { username: input.username } } },
          },
          select: {
            ...userCourseSelect,
            userCourses: {
              ...userCourseSelect.userCourses,
              where: { user: { username: input.username }, completed },
            },
          },
        });

        return course;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })

  .query('userRoadmap', {
    input: z.object({
      userId: z.number(),
    }),
    async resolve({ input }) {
      try {
        const courses = await prisma.content.findMany({
          where: {
            contentType: { name: ContentType.COURSE },
            course: {
              userCourses: {
                some: { userId: input.userId },
                every: { roadmap: true },
              },
            },
          },
          select: defaultCourseSelect,
        });

        return courses;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
