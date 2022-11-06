import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';
import {
  BROWSE_COURSES_ITEMS,
  TEST_QUESTIONS_BY_LEVEL,
  TEST_COOLDOWN_MS,
  TEST_DURATION_MS,
  TEST_PASS_RATE,
} from '~/utils/constants';

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
  userId: true,
  courseId: true,
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
  isCoolDownOver: true,
  expiredOn: true,
  cratedAt: true,
});

const updateInstanceStatus = async (
  testInstance: Prisma.TestinstanceGetPayload<{
    select: typeof testInstanceSelect;
  }> | null
) => {
  if (!testInstance) return null;

  let isExpired = testInstance.isExpired;
  let isCoolDownOver = testInstance.isCoolDownOver;
  let expiredOn: Date | null = testInstance.expiredOn;
  let update = false;
  let returnTest: Prisma.TestinstanceGetPayload<{
    select: typeof testInstanceSelect;
  }>;
  let coolDownTime = 0;
  let expiryTime = 0;

  if (!testInstance.isExpired) {
    expiryTime =
      TEST_DURATION_MS -
      (new Date().getTime() - testInstance.cratedAt.getTime());
    if (expiryTime <= 0) {
      isExpired = true;
      expiredOn = new Date();
      update = true;
    }
  }
  if (expiredOn) {
    coolDownTime =
      TEST_COOLDOWN_MS - (new Date().getTime() - expiredOn.getTime());
    if (coolDownTime <= 0) {
      isCoolDownOver = true;
      update = true;
    }
  }
  if (update) {
    const updInstance = await prisma.testinstance.update({
      where: { id: testInstance.id },
      data: { isExpired, isCoolDownOver, expiredOn },
      select: testInstanceSelect,
    });

    returnTest = updInstance;
  } else {
    returnTest = testInstance;
  }
  return { ...returnTest, coolDownTime, expiryTime };
};

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
  .query('single', {
    input: z.object({ courseId: z.number() }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        console.log('Ostia');
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const userId = ctx.session.user.userId;

        const existingInstance = await prisma.testinstance.findFirst({
          where: { courseId: input.courseId, userId },
          select: testInstanceSelect,
        });

        const returnTest = await updateInstanceStatus(existingInstance);

        return returnTest;
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
    input: z.object({ testId: z.number(), answers: z.record(z.string()) }),
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const qIds = Object.keys(input.answers).map((k) => Number(k));
        const aIds = Object.values(input.answers).map((k) => Number(k));

        const testInstance = await prisma.testinstance.findUniqueOrThrow({
          where: { id: input.testId },
          select: testInstanceSelect,
        });

        if (testInstance.questions.length !== qIds.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Bad Request`,
          });
        }

        for (let i = 0; i < qIds.length; i++) {
          await prisma.testinstanceQuestion.update({
            where: {
              instanceId_questionId: {
                instanceId: input.testId,
                questionId: qIds[i],
              },
            },
            data: { givenAnswerId: aIds[i] },
          });
        }

        const results = await prisma.testQuestion.findMany({
          where: {
            id: { in: qIds },
            answers: { some: { id: { in: aIds }, correct: true } },
          },
          select: {
            id: true,
          },
        });

        const passed = results.length / qIds.length > TEST_PASS_RATE;

        console.log(
          `Questions ${qIds.length}, correct: ${results.length}, ration: ${
            results.length / qIds.length
          }`
        );

        const test = await prisma.testinstance.update({
          where: { id: input.testId },
          data: {
            expiredOn: new Date(),
            isSubmitted: true,
            isExpired: true,
            isPassed: passed,
          },
          select: testInstanceSelect,
        });

        await prisma.userCourse.upsert({
          where: {
            userId_courseId: {
              userId: testInstance.userId,
              courseId: testInstance.courseId,
            },
          },
          update: { lastTestPassed: passed },
          create: {
            userId: testInstance.userId,
            courseId: testInstance.courseId,
            lastTestPassed: passed,
          },
        });

        return test;
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
        const userId = ctx.session.user.userId;

        let existingInstance = await prisma.testinstance.findFirst({
          where: { courseId: courseId, userId },
          select: testInstanceSelect,
        });

        existingInstance = await updateInstanceStatus(existingInstance);
        if (existingInstance) {
          // throw an error if not yet expired or expired but cooldown not passed
          if (!existingInstance.isCoolDownOver) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Bad Request`,
            });
          } else {
            await prisma.testinstance.delete({
              where: { id: existingInstance.id },
            });
          }
        }

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
        const techs = course.content.technologies.map((t) => t.slug);

        let levelSlug = '';
        if (levels.includes('advanced')) {
          levelSlug = 'advanced';
        } else if (levels.includes('intermediate')) {
          levelSlug = 'intermediate';
        } else if (levels.includes('beginner')) {
          levelSlug = 'beginner';
        }

        const questionsToExtract = TEST_QUESTIONS_BY_LEVEL[levelSlug];

        const questionsByTech = Math.floor(questionsToExtract / techs.length);

        type QuestionIds = Array<{ id: number }>;
        const questionIds: QuestionIds = [];

        for (let i = 0; i < techs.length; i++) {
          const limit =
            i < techs.length - 1
              ? questionsByTech
              : questionsToExtract - questionsByTech * i;
          console.log('limit');
          console.log(limit);
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

        // const questions = await prisma
        const testInstance = await prisma.testinstance.create({
          data: { courseId, userId },
          select: { id: true },
        });

        const instanceQuestionData = questionIds
          .map((q) => ({ ...q, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map((q) => ({
            questionId: q.id,
            instanceId: testInstance.id,
          }));

        await prisma.testinstanceQuestion.createMany({
          data: instanceQuestionData,
        });

        const test = await prisma.testinstance.findUniqueOrThrow({
          where: { id: testInstance.id },
          select: testInstanceSelect,
        });

        return { ...test, expiryTime: TEST_DURATION_MS };
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
