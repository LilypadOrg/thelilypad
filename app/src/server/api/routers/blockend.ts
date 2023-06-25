import { z } from 'zod';
import { env } from '~/env';
import { TokenMedata } from '~/types/types';
import fetch from 'node-fetch';
import { ethers } from 'ethers';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const blockenRouter = createTRPCRouter({
  signCreateMember: protectedProcedure
    .input(
      z.object({
        member: z.string(),
        xp: z.number(),
        courses: z.number().array(),
      })
    )
    .query(async ({ input }) => {
      console.log(`Member: ${input.member}`);
      console.log(`Xp: ${input.xp}`);
      console.log(`Courses: ${input.courses}`);

      const ethHash = ethers.utils.solidityKeccak256(
        ['address', 'uint256', 'uint256[]', 'string'],
        [input.member, input.xp, [...input.courses], '']
      );

      const provider = ethers.providers.getDefaultProvider('homestead');
      const wallet = new ethers.Wallet(env.SIGNER_PRIVATE_KEY, provider);
      const ethSignature = await wallet.signMessage(
        ethers.utils.arrayify(ethHash)
      );

      console.log(`Create Member Signature: ${ethSignature}`);
      return ethSignature;
    }),

  signCompleteEvent: protectedProcedure
    .input(
      z.object({
        address: z.string(),
        courseId: z.number(),
      })
    )
    .query(async ({ input }) => {
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
    }),

  getTokenMetadata: publicProcedure
    .input(
      z.object({
        tokenUri: z.string(),
      })
    )
    .query(async ({ input }) => {
      const data = await (await fetch(input.tokenUri.toString())).json();
      return data as TokenMedata;
    }),
});
