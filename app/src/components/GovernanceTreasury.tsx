import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDAOTreasure } from '~/hooks/useDAOTreasure';
import { formatNumber } from '~/utils/formatters';
import { ethers } from 'ethers';
import { api } from '~/utils/api';
import Image from 'next/image';

const GovernanceTreasury = () => {
  //const { data } = trpc.useQuery(['environment.getEnvironment']);
  //const env = data;
  const utils = api.useContext();
  api.external.getTreasureTokenPrice.useQuery(undefined, {
    onSuccess: (data) => {
      if ((data ?? '0') != '0') {
        setPriceUsd(data ?? '0');
      }
    },
    onError: () => {
      console.error('error');
    },
  });

  const { treasureValue } = useDAOTreasure();
  //const treasureValue = 0;
  const fmtTreasureBalance = ethers.utils.formatUnits(
    (treasureValue ?? 0).toString(),
    'ether'
  );
  const [priceUsd, setPriceUsd] = useState('');
  const [treasureUsd, setTreasureUsd] = useState('');

  const fetchPrice = useCallback(() => {
    utils.external.getTreasureTokenPrice.invalidate();
  }, [utils.external.getTreasureTokenPrice]);

  useEffect(() => {
    let controller: AbortController;

    fetchPrice();

    const interval = setInterval(() => {
      fetchPrice();
    }, 3000);
    return () => {
      clearInterval(interval);
      if (controller) {
        try {
          controller.abort();
        } catch (err) {
          console.error(`Error aborting controller: ${err}`);
        }
      }
    };
  }, [fetchPrice]);

  useMemo(() => {
    let fmtTreasureBalanceUsd;
    if (treasureValue && priceUsd) {
      const treasureBalanceUsd =
        Number(formatNumber(Number(fmtTreasureBalance), 4)) * Number(priceUsd);
      fmtTreasureBalanceUsd = formatNumber(treasureBalanceUsd, 2); //formatEther(treasureBalanceUsd, 2);

      setTreasureUsd(fmtTreasureBalanceUsd);
    }

    return fmtTreasureBalanceUsd ?? '0.0';
  }, [treasureValue, priceUsd, fmtTreasureBalance]);

  return (
    <div
      className="rounded-sm border-4 border-polygon-purple"
      style={{ padding: '5px 30px 5px' }}
    >
      <h3>Treasury</h3>
      <div className="grid grid-flow-col grid-cols-12 gap-1">
        <div className="flex shrink items-center">
          <Image
            src="https://cryptologos.cc/logos/polygon-matic-logo.png?v=024"
            width="28"
            height="28"
            alt="Polygon Logo"
          />
        </div>
        <div className="row-span-11 flex items-start">
          <h5>{fmtTreasureBalance}</h5>
        </div>
      </div>
      <h6>$&nbsp;{treasureUsd}</h6>
      <h6>
        <p style={{ color: '#7b61ff' }}>
          This treasury exists for supporting developers of the LilyPad
          Community to build Web3 Projects.
        </p>
      </h6>
    </div>
  );
};

// GovernanceTreasury.displayName = 'GovernanceTreasury';

export default GovernanceTreasury;
