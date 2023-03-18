import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { BROWSE_COURSES_ITEMS } from '~/utils/constants';
import { deleteProjectImage } from '~/utils/files';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

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

export const projectRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z
        .object({
          tags: z.array(z.string()).or(z.string()).optional(),
          technologies: z.array(z.string()).or(z.string()).optional(),
          levels: z.array(z.string()).or(z.string()).optional(),
          take: z.number().min(1).max(100).optional(),
          visibility: z.enum(['Visible', '', 'Hidden', 'All']).optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      let isVisible: boolean | undefined = true;
      if (input?.visibility === 'Hidden') {
        isVisible = false;
      } else if (input?.visibility === 'All') {
        isVisible = undefined;
      }

      const projects = await ctx.prisma.communityProject.findMany({
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
      });
      return projects;
    }),

  random: publicProcedure.query(async ({ ctx }) => {
    const projectCount = await ctx.prisma.communityProject.count();
    const randProject = Math.floor(Math.random() * projectCount);
    const project = await ctx.prisma.communityProject.findFirst({
      take: 1,
      skip: randProject,
      select: defaultProjectSelect,
    });

    return project;
  }),

  byId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const userId = ctx.session?.user.userId;
      const isAdmin = ctx.session?.user?.isAdmin || false;

      const project = await ctx.prisma.communityProject.findFirst({
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
    }),

  delete: adminProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
    const project = await ctx.prisma.communityProject.delete({
      where: { id: input },
      select: defaultProjectSelect,
    });
    if (project.content.coverImageUrl) {
      deleteProjectImage(project.content.coverImageUrl);
    }

    return project;
  }),

  setIsVisible: adminProcedure
    .input(
      z.object({
        id: z.number(),
        isVisible: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, isVisible } = input;
      const project = await ctx.prisma.communityProject.update({
        where: { id },
        data: { isVisible },
      });
      return project;
    }),
});
