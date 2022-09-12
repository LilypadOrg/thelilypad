import { PrismaClient } from '@prisma/client';
import tags from './seedData/tags.json';
import technologies from './seedData/technologies.json';
import courseLevels from './seedData/courseLevels.json';
import courses from './seedData/courses.json';
import resources from './seedData/resources.json';
import userLevels from './seedData/userLevels.json';
import contentTypes from './seedData/contentTYpes.json';
import { slugify } from '../src/utils/formatters';

const prisma = new PrismaClient();

async function main() {
  await truncateAllTables();
  await seedTags();
  await seedTechnologies();
  await seedContentTypes();
  await seedCourseLevels();
  await seedUserLevels();
  await seedCourses();
  await seedResources();
}

const truncateAllTables = async () => {
  await prisma.resource.deleteMany();
  await prisma.course.deleteMany();
  await prisma.content.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.courseLevel.deleteMany();
  await prisma.userLevel.deleteMany();
  await prisma.contentType.deleteMany();
};

const seedTechnologies = async () => {
  const data = technologies.map((t) => ({ name: t, slug: slugify(t) }));

  const created = await prisma.technology.createMany({
    data,
  });

  console.log(`Technologies created ${created.count}`);
};

const seedTags = async () => {
  const data = tags.map((t) => ({ name: t, slug: slugify(t) }));

  const created = await prisma.tag.createMany({
    data,
  });

  console.log(`Tags created ${created.count}`);
};

const seedCourseLevels = async () => {
  const data = courseLevels.map((t) => ({ name: t, slug: slugify(t) }));

  const created = await prisma.courseLevel.createMany({
    data,
  });

  console.log(`Course Levels created ${created.count}`);
};

const seedUserLevels = async () => {
  const created = await prisma.userLevel.createMany({ data: userLevels });

  console.log(`User Levels created ${created.count}`);
};

const seedContentTypes = async () => {
  const data = contentTypes.map((t) => ({ name: t, slug: slugify(t) }));

  const created = await prisma.contentType.createMany({
    data,
  });

  console.log(`Content types created ${created.count}`);
};

const seedCourses = async () => {
  const data = courses.map((c) => ({
    id: c.id,
    title: c.title,
    slug: slugify(c.title),
    description: c.description,
    url: c.url,
    coverImageUrl: c.coverImageUrl,
    technologies: { connect: c.technologies.map((l) => ({ name: l })) },
    tags: { connect: c.tags.map((l) => ({ name: l })) },
    contentType: { connect: { name: 'Course' } },
    course: {
      create: {
        id: c.id,
        xp: c.xp,
        levels: { connect: c.levels.map((l) => ({ name: l })) },
      },
    },
  }));

  data.forEach(async (course) => {
    await prisma.content.create({ data: course });
  });

  console.log(`Courses created ${data.length}`);
};

const seedResources = async () => {
  const data = resources.map((c) => ({
    id: c.id,
    title: c.title,
    slug: slugify(c.title),
    description: c.description,
    url: c.url,
    contentType: { connect: { name: 'Resource' } },
    technologies: { connect: c.technologies.map((l) => ({ name: l })) },
    tags: { connect: c.tags.map((l) => ({ name: l })) },
    resource: {
      create: {
        id: c.id,
      },
    },
  }));

  data.forEach(async (d) => {
    await prisma.content.create({ data: d });
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
