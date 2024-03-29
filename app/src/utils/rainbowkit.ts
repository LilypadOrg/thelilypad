// import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient } from 'wagmi';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const availableChains =
  process.env.NODE_ENV === 'production'
    ? [chain.polygonMumbai]
    : [chain.polygon, chain.polygonMumbai, chain.localhost];

const providers =
  process.env.NODE_ENV === 'production'
    ? [
        publicProvider(),
        // alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }),
      ]
    : [
        publicProvider(),
        // alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }),
      ];

const { chains, provider } = configureChains(availableChains, providers);

const { connectors } = getDefaultWallets({
  appName: 'The Lily Pad',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { chains, wagmiClient };
