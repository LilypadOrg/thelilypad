import { PrismaClient } from '@prisma/client';
import questions from '../seedData/testQuestions.json';

const QUESTIONS_PER_LEVEL = 20;

const options = [
  {
    tech: 'Solidity',
    prefix: 'SOL-BEG',
    level: 'Beginner',
  },
  {
    tech: 'Solidity',
    prefix: 'SOL-INT',
    level: 'Intermediate',
  },
  {
    tech: 'Solidity',
    prefix: 'SOL-ADV',
    level: 'Advanced',
  },
  {
    tech: 'Hardhat',
    prefix: 'HHA-BEG',
    level: 'Beginner',
  },
  {
    tech: 'Hardhat',
    prefix: 'HHA-INT',
    level: 'Intermediate',
  },
  {
    tech: 'Hardhat',
    prefix: 'HHA-ADV',
    level: 'Advanced',
  },
  {
    tech: 'ChainLink',
    prefix: 'LNK-BEG',
    level: 'Beginner',
  },
  {
    tech: 'ChainLink',
    prefix: 'LNK-INT',
    level: 'Intermediate',
  },
  {
    tech: 'ChainLink',
    prefix: 'LNK-ADV',
    level: 'Advanced',
  },
  {
    tech: 'JavaScript',
    prefix: 'JS-BEG',
    level: 'Beginner',
  },
  {
    tech: 'JavaScript',
    prefix: 'JS-INT',
    level: 'Intermediate',
  },
  {
    tech: 'JavaScript',
    prefix: 'JS-ADV',
    level: 'Advanced',
  },
  {
    tech: 'Blockchain',
    prefix: 'BLK-BEG',
    level: 'Beginner',
  },
  {
    tech: 'Blockchain',
    prefix: 'BLK-INT',
    level: 'Intermediate',
  },
  {
    tech: 'Blockchain',
    prefix: 'BLK-ADV',
    level: 'Advanced',
  },
  {
    tech: 'Ethereum',
    prefix: 'ETH-BEG',
    level: 'Beginner',
  },
  {
    tech: 'Ethereum',
    prefix: 'ETH-INT',
    level: 'Intermediate',
  },
  {
    tech: 'Ethereum',
    prefix: 'ETH-ADV',
    level: 'Advanced',
  },
  {
    tech: 'Bitcoin',
    prefix: 'BTC-BEG',
    level: 'Beginner',
  },
  {
    tech: 'Bitcoin',
    prefix: 'BTC-INT',
    level: 'Intermediate',
  },
  {
    tech: 'Bitcoin',
    prefix: 'BTC-ADV',
    level: 'Advanced',
  },
];

const prisma = new PrismaClient();

export const seedTests = async () => {
  seedQuestions();
};

export const seedTestsBulk = async () => {
  await seedQuestionsBulk();
  await seedAnswersBulk();
};

const seedQuestions = async () => {
  const data = questions.map((q) => ({
    question: q.question,
    code: q.code,
    technology: { connect: { name: q.technology } },
    level: { connect: { name: q.level } },
    answers: {
      create: q.answers.map((a) => ({
        answer: a.answer,
        correct: !!a.correct,
      })),
    },
  }));

  for (let i = 0; i < data.length; i++) {
    await prisma.testQuestion.create({ data: data[i] });
  }

  console.log(`${data.length} questions created `);
};

const seedQuestionsBulk = async () => {
  const parsedQuestions = questions.map((q, idx) => ({
    question: `${q.question}`,
    code: `${q.code}`,
    technology: { connect: { name: q.technology } },
    level: { connect: { name: q.level } },
  }));
  var techQuestions: string[] = [];

  parsedQuestions.forEach((item) => {
    if (!techQuestions.includes(item.technology.connect.name)) {
      techQuestions.push(item.technology.connect.name);
    }
  });

  for (let i = 0; i < techQuestions.length; i++) {
    console.log(techQuestions[i]);
    const filteredTechQuestions = parsedQuestions.filter(
      (q) => q.technology.connect.name == techQuestions[i]
    );

    for (let idx = 0; idx < filteredTechQuestions.length; idx++) {
      await prisma.testQuestion.create({ data: filteredTechQuestions[idx] });
    }

    console.log(
      `${filteredTechQuestions.length} ${filteredTechQuestions[0].technology.connect.name} questions created`
    );
  }

  /*for (let o = 0; o < options.length; o++) {
    const questions = [...Array(QUESTIONS_PER_LEVEL)].map((e, i) => ({
      question: `${options[o].tech} ${options[o].level} question ${i + 1}`,
      code: `${options[o].prefix}-${(i + 1).toString().padStart(4, '0')}`,
      technology: { connect: { name: options[o].tech } },
      level: { connect: { name: options[o].level } },
    }));

    for (let i = 0; i < questions.length; i++) {
      await prisma.testQuestion.create({ data: questions[i] });
    }

    console.log(
      `${questions.length} ${options[o].tech} ${options[o].level} questions created`
    );
  }*/
};

const seedAnswersBulk = async () => {
  const answers = questions.map((e, i) =>
    e.answers.map((f, j) => ({
      answer: f.answer,
      correct: f.correct ?? false,
      question: {
        connect: {
          code: e.code,
        },
      },
    }))
  );

  const flatAnswers = answers.flat(1);

  for (let i = 0; i < flatAnswers.length; i++) {
    await prisma.testAnswer.create({ data: flatAnswers[i] });
  }

  console.log(`${flatAnswers.length} answers created`);

  /*for (let o = 0; o < options.length; o++) {
    const answers = [...Array(QUESTIONS_PER_LEVEL)].map((e, i) =>
      [...Array(4)].map((f, j) => ({
        answer: `Answer ${options[o].prefix}-${(i + 1)
          .toString()
          .padStart(4, '0')} ${j + 1}`,
        correct: j === 0 ? true : false,
        question: {
          connect: {
            code: `${options[o].prefix}-${(i + 1).toString().padStart(4, '0')}`,
          },
        },
      }))
    );

    const flatAnswers = answers.flat(1);

    for (let i = 0; i < flatAnswers.length; i++) {
      await prisma.testAnswer.create({ data: flatAnswers[i] });
    }

    console.log(
      `${flatAnswers.length} ${options[o].tech} ${options[o].level} answers created`
    );
  }*/
};
