/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import { courseRouter } from './courses';
import { userCourseRouter } from './userCourses';
import superjson from 'superjson';
import { userRouter } from './users';
import { tagRouter } from './tags';
import { technologyRouter } from './technologies';
import { courseLevelRouter } from './courseLevels';
import { resourceRouter } from './resources';
import { blockenRouter } from './blockend';
import { projectsRouter } from './projects';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  /**
   * Add a health check endpoint to be called with `/api/trpc/healthz`
   */
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  /**
   * Merge `courseRouter` under `course.`
   */
  .merge('courses.', courseRouter)
  .merge('usercourses.', userCourseRouter)
  .merge('users.', userRouter)
  .merge('tags.', tagRouter)
  .merge('technologies.', technologyRouter)
  .merge('courseLevels.', courseLevelRouter)
  .merge('resources.', resourceRouter)
  .merge('projects.', projectsRouter)
  .merge('blockend.', blockenRouter);

export type AppRouter = typeof appRouter;
