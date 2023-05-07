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
import Navbar from '~/components/Navbar';
import Footer from '~/components/Footer';
import { Session } from 'next-auth';
import Head from 'next/head';
import Avatar from '~/components/Avatar';
import { api } from '~/utils/api';

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
            <main className="mx-auto min-h-[100vh]">
              <Component {...pageProps} />
            </main>
            <Footer />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default api.withTRPC(MyApp);
