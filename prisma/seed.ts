import { PrismaClient } from '@prisma/client';
import tags from './seedData/tags.json';
import technologies from './seedData/technologies.json';
import courseLevels from './seedData/courseLevels.json';
import courses from './seedData/courses.json';
import resources from './seedData/resources.json';
import userLevels from './seedData/userLevels.json';
import { slugify } from '../src/utils/formatters';

const prisma = new PrismaClient();

async function main() {
  await seedTags();
  await seedTechnologies();
  await seedCourseLevels();
  await seedUserLevels();
  await seedCourses();
  await seedResources();
}

const seedTechnologies = async () => {
  await prisma.technology.deleteMany();

  const data = technologies.map((t) => ({ name: t, slug: slugify(t) }));

  const created = await prisma.technology.createMany({
    data,
  });

  console.log(`Technologies created ${created.count}`);
};

const seedTags = async () => {
  await prisma.tag.deleteMany();

  const data = tags.map((t) => ({ name: t, slug: slugify(t) }));

  const created = await prisma.tag.createMany({
    data,
  });

  console.log(`Tags created ${created.count}`);
};

const seedCourseLevels = async () => {
  await prisma.courseLevel.deleteMany();

  const data = courseLevels.map((t) => ({ name: t, slug: slugify(t) }));

  const created = await prisma.courseLevel.createMany({
    data,
  });

  console.log(`Course Levels created ${created.count}`);
};

const seedUserLevels = async () => {
  await prisma.userLevel.deleteMany();

  const created = await prisma.userLevel.createMany({ data: userLevels });

  console.log(`User Levels created ${created.count}`);
};

const seedCourses = async () => {
  await prisma.course.deleteMany();

  const data = courses.map((c) => ({
    ...c,
    slug: slugify(c.title),
    levels: { connect: c.levels.map((l) => ({ name: l })) },
    technologies: { connect: c.technologies.map((l) => ({ name: l })) },
    tags: { connect: c.tags.map((l) => ({ name: l })) },
  }));

  data.forEach(async (course) => {
    await prisma.course.create({ data: course });
  });

  console.log(`Courses created ${data.length}`);
};

const seedResources = async () => {
  await prisma.resource.deleteMany();

  const data = resources.map((c) => ({
    ...c,
    slug: slugify(c.title),
    technologies: { connect: c.technologies.map((l) => ({ name: l })) },
    tags: { connect: c.tags.map((l) => ({ name: l })) },
  }));

  data.forEach(async (resource) => {
    await prisma.resource.upsert({
      where: {
        title: resource.title,
      },
      update: resource,
      create: resource,
    });
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
