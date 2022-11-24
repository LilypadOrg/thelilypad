import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { prisma } from '~/server/prisma';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || '{}')
          );

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null);
          if (!nextAuthUrl) {
            return null;
          }

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          await siwe.validate(credentials?.signature || '');
          const user = await prisma.user.upsert({
            where: { address: siwe.address },
            update: {},
            create: {
              address: siwe.address,
              levelNumber: 1,
              username: siwe.address,
            },
          });

          return {
            // id: siwe.address,
            id: user.id,
            address: siwe.address,
            name: user.username,
            // image: getSBTLocalURL(user.levelNumber),
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === 'GET' && req.query.nextauth?.includes('signin');

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      jwt: async ({ token, user }) => {
        user &&
          (token.user = { userId: Number(user.id), address: user.address });
        return token;
      },

      async session({ session, token }) {
        console.log('token');
        console.log(token);
        // session.address = token.sub;
        session.user = token.user;
        session.user.name = token.name;

        return session;
      },

      // async session({ session, token }) {
      //   session.address = token.sub;
      //   if (session.user) {
      //     session.user.name = token.sub;
      //     session.user.image = 'https://www.fillmurray.com/128/128';
      //   } else {
      //     session.user = {
      //       name: token.sub,
      //       name: token.name,
      //     };
      //   }
      //   return session;
      // },
    },
  });
}
