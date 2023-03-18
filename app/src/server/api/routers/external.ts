import axios from 'axios';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const externalRouter = createTRPCRouter({
  getTreasureTokenPrice: publicProcedure.query(async ({}) => {
    const controller: AbortController = new AbortController();

    let link = '';

    if (process.env.NODE_ENV == 'development')
      link = 'https://api.etherscan.io/api?module=stats&action=ethprice';
    else if (process.env.NODE_ENV == 'test')
      link = `https://api-testnet.polygonscan.com/api?module=stats&action=maticprice&apikey=${process.env.POLYGON_API_KEY}`;
    else
      link = `https://api.polygonscan.com/api?module=stats&action=maticprice&apikey=${process.env.POLYGON_API_KEY}`;

    const result = await axios.get(link, {
      signal: controller.signal,
    });

    const tokenPrice: string =
      process.env.NODE_ENV == 'development'
        ? result.data.result.ethusd
        : result.data.result.maticusd;

    return tokenPrice;
  }),
});
