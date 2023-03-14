import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ContentType } from '~/types/types';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';
import { createTRPCRouter, publicProcedure } from '../trpc';

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
      url: true,
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

export const courseRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z
        .object({
          tags: z.array(z.string()).or(z.string()).optional(),
          technologies: z.array(z.string()).or(z.string()).optional(),
          levels: z.array(z.string()).or(z.string()).optional(),
          take: z.number().min(1).max(100).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user.userId || -1;
      const courses = await ctx.prisma.course.findMany({
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
    }),

  related: publicProcedure
    .input(
      z.object({
        tags: z.array(z.string()).or(z.string()).optional(),
        technologies: z.array(z.string()).or(z.string()).optional(),
        excludeCourseId: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const courses = await ctx.prisma.course.findMany({
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
        },
        select: defaultCourseSelect,
      });
      return courses;
    }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user.userId;
      const { id } = input;
      const course = await ctx.prisma.course.findUnique({
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
    }),

  byUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
        completed: z.boolean().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const completed = !!input.completed;
      const course = await ctx.prisma.course.findMany({
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
    }),

  userRoadmap: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const courses = await ctx.prisma.content.findMany({
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
    }),
});
