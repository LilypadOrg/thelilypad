import { createTRPCRouter } from './trpc';
import { courseRouter } from './routers/courses';
import { userCourseRouter } from './routers/userCourses';
import { userRouter } from './routers/users';
import { tagRouter } from './routers/tags';
import { technologyRouter } from './routers/technologies';
import { levelRouter } from './routers/levels';
import { resourceRouter } from './routers/resources';
import { projectRouter } from './routers/projects';
import { blockenRouter } from './routers/blockend';
import { testRouter } from './routers/tests';
import { daoRouter } from './routers/dao';
import { externalRouter } from './routers/external';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  courses: courseRouter,
  users: userRouter,
  projects: projectRouter,
  usercourses: userCourseRouter,
  tags: tagRouter,
  technologies: technologyRouter,
  levels: levelRouter,
  resources: resourceRouter,
  tests: testRouter,
  blockend: blockenRouter,
  dao: daoRouter,
  external: externalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
