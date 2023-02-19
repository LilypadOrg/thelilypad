import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';

export const defaultProjectSelect =
  Prisma.validator<Prisma.CommunityProjectSelect>()({
    id: true,
    author: true,
    codeUrl: true,
    isVisible: true,
    submittedById: true,
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
        visibility: z.enum(['Visible', '', 'Hidden', 'All']).optional(),
      })
      .optional(),
    async resolve({ input }) {
      let isVisible: boolean | undefined = true;
      if (input?.visibility === 'Hidden') {
        isVisible = false;
      } else if (input?.visibility === 'All') {
        isVisible = undefined;
      }

      try {
        const projects = await prisma.communityProject.findMany({
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
            isVisible,
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
        return projects;
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
    async resolve({ input, ctx }) {
      const { id } = input;
      const userId = ctx.session?.user?.userId || -1;
      const isAdmin = ctx.session?.user?.isAdmin || false;
      const project = await prisma.communityProject.findFirst({
        where: {
          id,
          ...(isAdmin
            ? {}
            : { OR: [{ isVisible: true }, { submittedById: userId }] }),
        },
        select: defaultProjectSelect,
      });
      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No project with id '${id}'`,
        });
      }
      return project;
    },
  })
  // .mutation('create', {
  //   input: z.object({
  //     author: z.string(),
  //     title: z.string(),
  //     description: z.string(),
  //     url: z.string().url(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     if (!ctx.session?.user) {
  //       throw new TRPCError({
  //         code: 'UNAUTHORIZED',
  //         message: `Unauthorized`,
  //       });
  //     }
  //     try {
  //       const { author, title, description, url } = input;
  //       const submittedById = ctx.session.user.userId;
  //       const project = prisma.communityProject.create({
  //         data: {
  //           author,
  //           submittedBy: { connect: { id: submittedById } },
  //           content: {
  //             create: {
  //               title,
  //               description,
  //               url,
  //               slug: slugify(title),
  //               contentType: {
  //                 connect: { name: ContentType.COMMUNITY_PROJECT },
  //               },
  //             },
  //           },
  //         },
  //       });
  //       return project;
  //     } catch (err) {
  //       throw new TRPCError({
  //         code: 'BAD_REQUEST',
  //         message: `Error updating course status`,
  //       });
  //     }
  //   },
  // })
  .mutation('delete', {
    input: z.number(),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const project = await prisma.communityProject.delete({
          where: { id: input },
        });
        return project;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error deleting project`,
        });
      }
    },
  })
  .mutation('setIsVisible', {
    input: z.object({
      id: z.number(),
      isVisible: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const { id, isVisible } = input;
        const project = await prisma.communityProject.update({
          where: { id },
          data: { isVisible },
        });
        return project;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error updating course status`,
        });
      }
    },
  });
