import { TRPCError } from '@trpc/server';
import { createRouter } from '~/server/createRouter';
import axios from 'axios';

export const externalRouter = createRouter().query('getTreasureTokenPrice', {
  async resolve() {
    try {
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
    } catch (err) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Something went wrong'`,
      });
    }
  },
});
