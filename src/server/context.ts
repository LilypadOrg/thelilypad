/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  // for API-response caching see https://trpc.io/docs/caching

  const session = await getSession({ req: opts.req });
  // console.log('createContext for', session?.user?.name ?? 'unknown user');
  return {
    req: opts.req,
    res: opts.res,
    session,
  };
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
// interface CreateContextOptions {
//   session: Session | null;
// }

// export async function createContextInner(_opts: CreateContextOptions) {
//   return {};
// }

// export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

// /**
//  * Creates context for an incoming request
//  * @link https://trpc.io/docs/context
//  */
// export async function createContext(
//   opts: trpcNext.CreateNextContextOptions
// ): Promise<Context> {
//   // for API-response caching see https://trpc.io/docs/caching

//   return await createContextInner({});
// }
