import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { z } from 'zod';
import Web3 from 'web3';
import { env } from '~/server/env';

export const blockenRouter = createRouter()
  .query('signCreateMember', {
    input: z.object({
      name: z.string(),
      xp: z.number(),
      courses: z.number().array(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const web3 = new Web3();
        const hash = web3.utils.soliditySha3(
          { t: 'bytes', v: web3.utils.fromAscii(input.name) },
          { t: 'uint256', v: input.xp },
          ...input.courses,
          { t: 'string', v: '' }
        );
        if (!hash) throw new Error();
        const signature = web3.eth.accounts.sign(
          hash,
          env.SIGNER_PRIVATE_KEY
        ).signature;
        return signature;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong'`,
        });
      }
    },
  })
  .query('signCompleteEvent', {
    input: z.object({
      address: z.string(),
      courseId: z.number(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `Unauthorized`,
        });
      }
      try {
        const web3 = new Web3();
        const hash = web3.utils.soliditySha3(
          { t: 'address', v: input.address },
          { t: 'uint256', v: input.courseId }
        );
        if (!hash) throw new Error();
        const signature = web3.eth.accounts.sign(
          hash,
          env.SIGNER_PRIVATE_KEY
        ).signature;
        return signature;
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong'`,
        });
      }
    },
  });
