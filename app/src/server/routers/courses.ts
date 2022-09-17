import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { ContentType } from '~/types/types';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';

// const contentCourseSelect = Prisma.validator<Prisma.ContentSelect>()({
//   id: true,
//   title: true,
//   description: true,
//   coverImageUrl: true,
//   technologies: true,
//   tags: true,
//   slug: true,
//   course: {
//     select: {
//       id: true,
//       levels: true,
//       xp: true,
//       userCourses: {
//         select: {
//           roadmap: true,
//           completed: true,
//           completedOn: true,
//         },
//       },
//     },
//   },
// });

const defaultCourseSelect = Prisma.validator<Prisma.CourseSelect>()({
  id: true,
  levels: true,
  xp: true,
  userCourses: {
    select: {
      roadmap: true,
      completed: true,
      completedOn: true,
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
    async resolve({ input }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      try {
        // const userId = ctx.session?.user.userId || -1;
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
          select: defaultCourseSelect,
          // select: {
          //   ...defaultCourseSelect,
          //   userCourses: {
          //     ...defaultCourseSelect.userCourses,
          //     where: { userId },
          //   },
          // },
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
  })
  // .query('bySlug', {
  //   input: z.object({
  //     slug: z.string(),
  //   }),
  //   async resolve({ input }) {
  //     try {
  //       const { slug } = input;
  //       const course = await prisma.course.findFirst({
  //         where: { content: { slug } },
  //         select: defaultCourseSelect,
  //       });

  //       if (!course) {
  //         throw new TRPCError({
  //           code: 'NOT_FOUND',
  //           message: `No course with slug '${slug}'`,
  //         });
  //       }
  //       return course;
  //     } catch (err) {
  //       console.error(err);
  //       throw new TRPCError({
  //         code: 'BAD_REQUEST',
  //         message: `Error retrieving data.`,
  //       });
  //     }
  //   },
  // })
  .query('byUser', {
    input: z.object({
      userId: z.number(),
    }),
    async resolve({ input }) {
      try {
        const courses = await prisma.content.findMany({
          where: {
            contentType: { name: ContentType.COURSE },
            course: { userCourses: { some: { userId: input.userId } } },
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
