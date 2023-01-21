import React, { useEffect, useMemo, useState } from 'react';
import { useDAOTreasure } from '~/hooks/useDAOTreasure';
import { formatNumber } from '~/utils/formatters';
import { ethers } from 'ethers';
import { trpc } from '~/utils/trpc';

const GovernanceTreasury = () => {
  //const { data } = trpc.useQuery(['environment.getEnvironment']);
  //const env = data;
  const utils = trpc.useContext();
  trpc.useQuery(['external.getTreasureTokenPrice'], {
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

  function fetchPrice() {
    utils.invalidateQueries(['external.getTreasureTokenPrice']);
  }

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
  }, []);

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
      className="rounded-lg border-4 border-polygon-purple"
      style={{ padding: '5px 30px 5px' }}
    >
      <h3>Treasury</h3>
      <div className="flex grid grid-flow-col grid-cols-12 gap-1">
        <div className="flex shrink items-center">
          <img
            src="https://cryptologos.cc/logos/polygon-matic-logo.png?v=024"
            width="32"
          />
        </div>
        <div className="row-span-11 flex items-start">
          <h4>{fmtTreasureBalance}</h4>
        </div>
      </div>
      <h5>$&nbsp;{treasureUsd}</h5>
      <br />
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
