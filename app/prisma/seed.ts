import { PrismaClient } from '@prisma/client';
import tags from './seedData/tags.json';
import technologies from './seedData/technologies.json';
import levels from './seedData/levels.json';
import courses from './seedData/courses.json';
import resources from './seedData/resources.json';
import userLevels from './seedData/userLevels.json';
import contentTypes from './seedData/contentTYpes.json';
import communityProjects from './seedData/communityProjects.json';
import accolades from './seedData/accolades.json';
import events from './seedData/events.json';
import { slugify } from '../src/utils/formatters';
import { seedTests, seedTestsBulk } from './seedScripts/seedTests';

const prisma = new PrismaClient();

async function main() {
  // await truncateAllTables();
  await seedTags();
  await seedTechnologies();
  await seedContentTypes();
  await seedLevels();
  await seedUserLevels();
  await seedCourses();
  await seedResources();
  await seedCommunityProjects();
  await seedAccolades();
  await seedEvents();
  await seedTestsBulk();
}

// const truncateAllTables = async () => {
//   await prisma.$transaction([
//     prisma.userCourse.deleteMany(),
//     prisma.communityProject.deleteMany(),
//     prisma.resource.deleteMany(),
//     prisma.course.deleteMany(),
//     prisma.communityProject.deleteMany(),
//     prisma.content.deleteMany(),
//     prisma.technology.deleteMany(),
//     prisma.tag.deleteMany(),
//     prisma.level.deleteMany(),
//     prisma.userLevel.deleteMany(),
//     prisma.accolade.deleteMany(),
//     prisma.contentType.deleteMany(),
//     prisma.testAnswer.deleteMany(),
//     prisma.testQuestion.deleteMany(),
//   ]);
// };

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

const seedLevels = async () => {
  const data = levels.map((t) => ({ name: t, slug: slugify(t) }));

  const created = await prisma.level.createMany({
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

  for (let i = 0; i < data.length; i++) {
    await prisma.content.create({ data: data[i] });
  }

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

  for (let i = 0; i < data.length; i++) {
    await prisma.content.create({ data: data[i] });
  }

  console.log(`Resources created ${data.length}`);
};

const seedCommunityProjects = async () => {
  const data = communityProjects.map((c) => ({
    id: c.id,
    title: c.title,
    slug: slugify(c.title),
    description: c.description,
    url: c.url,
    coverImageUrl: c.coverImageUrl,
    contentType: { connect: { name: 'Community Project' } },
    technologies: { connect: c.technologies.map((l) => ({ name: l })) },
    tags: { connect: c.tags.map((l) => ({ name: l })) },
    communityProject: {
      create: {
        id: c.id,
        author: c.author,
        codeUrl: c.codeUrl,
      },
    },
  }));

  for (let i = 0; i < data.length; i++) {
    await prisma.content.create({ data: data[i] });
  }

  console.log(`Community projects created ${data.length}`);
};

const seedAccolades = async () => {
  await prisma.accolade.createMany({ data: accolades });

  console.log(`Accolades created ${accolades.length}`);
};

const seedEvents = async () => {
  const data = events.map((c) => ({
    id: c.id,
    title: c.title,
    slug: slugify(c.title),
    description: c.description,
    url: c.url,
    coverImageUrl: c.coverImageUrl,
    technologies: { connect: c.technologies.map((l) => ({ name: l })) },
    tags: { connect: c.tags.map((l) => ({ name: l })) },
    contentType: { connect: { name: 'Event' } },
    event: {
      create: {
        id: c.id,
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
        location: c.location,
      },
    },
  }));

  for (let i = 0; i < data.length; i++) {
    await prisma.content.create({ data: data[i] });
  }

  console.log(`Events created ${data.length}`);
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
