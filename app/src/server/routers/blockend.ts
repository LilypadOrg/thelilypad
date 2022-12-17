import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import { z } from 'zod';
// import Web3 from 'web3';
import { env } from '~/server/env';
import { TokenMedata } from '~/types/types';
import fetch from 'node-fetch';
import { ethers } from 'ethers';

export const blockenRouter = createRouter()
  .query('signCreateMember', {
    input: z.object({
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
        const ethHash = ethers.utils.solidityKeccak256(
          ['uint256', 'uint256[]', 'string'],
          [input.xp, [...input.courses], '']
        );

        const provider = ethers.providers.getDefaultProvider('homestead');
        const wallet = new ethers.Wallet(env.SIGNER_PRIVATE_KEY, provider);
        const ethSignature = await wallet.signMessage(
          ethers.utils.arrayify(ethHash)
        );
        // console.log('ethHash');
        // console.log(ethHash);

        // console.log('ethSignature');
        // console.log(ethSignature);

        return ethSignature;

        // const web3 = new Web3();
        // const hash = web3.utils.soliditySha3(
        //   // { t: 'bytes', v: web3.utils.fromAscii(input.name) },
        //   { t: 'uint256', v: input.xp },
        //   ...input.courses,
        //   { t: 'string', v: '' }
        // );

        // if (!hash) throw new Error();
        // const signature = web3.eth.accounts.sign(hash, env.SIGNER_PRIVATE_KEY);

        // console.log('hash');
        // console.log(hash);
        // console.log('signature');
        // console.log(signature);

        // return signature;
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
        const ethHash = ethers.utils.solidityKeccak256(
          ['address', 'uint256'],
          [input.address, input.courseId]
        );

        const provider = ethers.providers.getDefaultProvider('homestead');
        const wallet = new ethers.Wallet(env.SIGNER_PRIVATE_KEY, provider);
        const ethSignature = await wallet.signMessage(
          ethers.utils.arrayify(ethHash)
        );

        return ethSignature;

        // const web3 = new Web3();
        // const hash = web3.utils.soliditySha3(
        //   { t: 'address', v: input.address },
        //   { t: 'uint256', v: input.courseId }
        // );
        // if (!hash) throw new Error();
        // const signature = web3.eth.accounts.sign(
        //   hash,
        //   env.SIGNER_PRIVATE_KEY
        // ).signature;
        // return signature;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong'`,
        });
      }
    },
  })
  .query('getTokenMetadata', {
    input: z.object({
      tokenUri: z.string(),
    }),
    async resolve({ input }) {
      try {
        const data = await (await fetch(input.tokenUri.toString())).json();
        return data as TokenMedata;
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong'`,
        });
      }
    },
  });
