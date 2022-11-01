import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import { BROWSE_COURSES_ITEMS, QUESTION_NUM_BY_LEVEL } from '~/utils/constants';

const defaultQuestionSelect = Prisma.validator<Prisma.TestQuestionSelect>()({
  id: true,
  code: true,
  question: true,
  level: {
    select: {
      name: true,
    },
  },
  technology: {
    select: {
      name: true,
    },
  },
  answers: {
    select: {
      id: true,
      answer: true,
    },
  },
});

const testInstanceSelect = Prisma.validator<Prisma.TestinstanceSelect>()({
  id: true,
  questions: {
    select: {
      question: {
        select: {
          ...defaultQuestionSelect,
        },
      },
      givenAnswer: true,
    },
  },
  isExpired: true,
  isSubmitted: true,
  isPassed: true,
  submittedOn: true,
  cratedAt: true,
});

export const testsRouter = createRouter()
  // read
  .query('filtered', {
    input: z
      .object({
        technologies: z.array(z.number()).or(z.number()).optional(),
        levels: z.array(z.number()).or(z.number()).optional(),
        take: z.number().min(1).max(100).optional(),
      })
      .optional(),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const questions = await prisma.testQuestion.findMany({
          where: {
            ...(input?.technologies ? { id: { in: input.technologies } } : {}),
            ...(input?.levels ? { level: { id: { in: input.levels } } } : {}),
          },
          take: input?.take || BROWSE_COURSES_ITEMS,
          select: defaultQuestionSelect,
        });
        return questions;
      } catch (err) {
        console.log('err');
        console.log(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .query('questionById', {
    input: z.number(),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user || ctx.session.user.userId > 0) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const question = await prisma.testQuestion.findUniqueOrThrow({
          where: { id: input },
          select: defaultQuestionSelect,
        });
        return question;
      } catch (err) {
        console.log('err');
        console.log(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .mutation('result', {
    input: z.record(z.string()),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const qIds = Object.keys(input).map((k) => Number(k));
        const aIds = Object.values(input).map((k) => Number(k));

        console.log('qIds');
        console.log(qIds);
        console.log('aIds');
        console.log(aIds);
        const results = await prisma.testQuestion.findMany({
          where: {
            id: { in: qIds },
          },
          select: {
            id: true,
            code: true,
            question: true,
            answers: {
              select: {
                id: true,
                answer: true,
                correct: true,
              },
              where: {
                id: { in: aIds },
                correct: true,
              },
            },
          },
        });
        console.log('results');
        console.log(results);
        console.log(
          `Questions ${qIds.length}, correct: ${results.length}, ration: ${
            results.length / qIds.length
          }`
        );

        return results;
      } catch (err) {
        console.log('query error');
        console.log(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  })
  .mutation('createInstance', {
    input: z.object({ courseId: z.number() }),
    async resolve({ ctx, input: { courseId } }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const course = await prisma.course.findUniqueOrThrow({
          where: { id: courseId },
          select: {
            levels: true,
            content: {
              select: {
                technologies: true,
              },
            },
          },
        });
        const levels = course.levels.map((c) => c.slug);
        console.log('levels');
        console.log(levels);

        const techs = course.content.technologies.map((t) => t.slug);
        console.log('techs');
        console.log(techs);

        let levelSlug = '';
        if (levels.includes('advanced')) {
          levelSlug = 'advanced';
        } else if (levels.includes('intermediate')) {
          levelSlug = 'intermediate';
        } else if (levels.includes('beginner')) {
          levelSlug = 'beginner';
        }
        console.log('levelSlug');
        console.log(levelSlug);

        const questionsToExtract = QUESTION_NUM_BY_LEVEL[levelSlug];
        console.log('questionsToExtract');
        console.log(questionsToExtract);

        const questionsByTech = Math.floor(questionsToExtract / techs.length);

        type QuestionIds = Array<{ id: number }>;
        const questionIds: QuestionIds = [];

        for (let i = 0; i < techs.length; i++) {
          const limit =
            i < techs.length - 1
              ? questionsByTech
              : questionsToExtract - questionsByTech * i;
          const questions: QuestionIds =
            await prisma.$queryRaw`select tq.id from "TestQuestion" tq
            INNER JOIN "Level" lv ON tq."levelId" = lv.id   
            INNER JOIN "Technology" tc ON tq."techId" = tc.id
            WHERE tc.slug = ${techs[i]}
            AND lv.slug = ${levelSlug}
            order by random()
            limit ${limit}`;

          questionIds.push(...questions);
        }

        console.log('questionIds');
        console.log(questionIds);

        // const questions = await prisma
        const testInstance = await prisma.testinstance.create({
          data: { courseId, userId: ctx.session.user.userId },
          select: { id: true },
        });

        const instanceQuestionData = questionIds.map((q) => ({
          questionId: q.id,
          instanceId: testInstance.id,
        }));

        await prisma.testinstanceQuestion.createMany({
          data: instanceQuestionData,
        });

        const test = await prisma.testinstance.findUniqueOrThrow({
          where: { id: testInstance.id },
        });

        return questionIds;
      } catch (err) {
        console.log('query error');
        console.log(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error retrieving data.`,
        });
      }
    },
  });
