import '../styles/globals.css';
import type { AppProps } from 'next/app';
// import Layout from '../components/Layout';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import { WagmiConfig } from 'wagmi';
import { wagmiClient, chains } from '../utils/rainbowkit';
import { withTRPC } from '@trpc/next';
import { AppRouter } from '~/server/routers/_app';
import superjson from 'superjson';
import Navbar from '~/components/Navbar';
import Footer from '~/components/Footer';
import { Session } from 'next-auth';
import Head from 'next/head';
import Avatar from '~/components/Avatar';

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to The Lily Pad',
});

const MyApp = ({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider avatar={Avatar} chains={chains}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
              />
            </Head>
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    // const url = 'https://thelilypad.vercel.app//api/trpc';

    const vercelUrl =
      process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
    const url = vercelUrl
      ? `https://${vercelUrl}/api/trpc`
      : 'http://localhost:3000/api/trpc';
    console.log({ url });
    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: {
      //   defaultOptions: {
      //     queries: { staleTime: 60 },
      //     queryCache: new QueryCache({
      //       onSuccess: () => {
      //       },
      //     }),
      //   },
      // },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
