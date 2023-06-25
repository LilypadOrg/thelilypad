import type { GetServerSidePropsContext } from 'next';
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  User,
} from 'next-auth';
import { prisma } from './db';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';
// import { getCsrfToken } from 'next-auth/react';

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
  interface Session extends DefaultSession {
    //   user: {
    //     id: string;
    //     // ...other properties
    //     // role: UserRole;
    //   } & DefaultSession['user'];
    // }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }

    user: {
      userId: number;
      address: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    address: string;
    isAdmin: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  providers: [
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

          console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null);

          if (!nextAuthUrl) {
            throw new Error('Next Auth URL not defined!');
          }

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            console.log(`Siwe Domain: ${siwe.domain}`);
            console.log(`nextAuthHost: ${nextAuthHost}`);
            throw new Error('siwe domain does not match nextAuthURL host');
          }

          // TODO: neeed to figure out how to get the csrf token
          // if (siwe.nonce !== (await getCsrfToken({ req }))) {
          //   return null;
          // }
          console.log(siwe);
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

          const nextAuthUser: User = {
            // id: siwe.address,
            id: user.id.toString(),
            address: siwe.address,
            name: user.username,
            isAdmin: user.isAdmin,
            // image: getSBTLocalURL(user.levelNumber),
          };

          return nextAuthUser;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      user &&
        (token.user = {
          userId: Number(user.id),
          address: user.address,
          isAdmin: user.isAdmin,
        });
      return token;
    },

    async session({ session, token }) {
      // session.address = token.sub;
      session.user = token.user;
      session.user.name = token.name;

      return session;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
