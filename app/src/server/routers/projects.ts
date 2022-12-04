import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';

const defaultProjectSelect = Prisma.validator<Prisma.CommunityProjectSelect>()({
  id: true,
  author: true,
  codeUrl: true,
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
});

export const projectsRouter = createRouter()
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
      try {
        const courses = await prisma.communityProject.findMany({
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
          select: defaultProjectSelect,
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
  .query('random', {
    async resolve() {
      try {
        const projectCount = await prisma.communityProject.count();
        const randProject = Math.floor(Math.random() * projectCount);
        const project = await prisma.communityProject.findFirst({
          take: 1,
          skip: randProject,
          select: defaultProjectSelect,
        });

        return project;
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
        const project = await prisma.communityProject.findUnique({
          where: { id },
          select: defaultProjectSelect,
        });

        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No course with id '${id}'`,
          });
        }
        return project;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
