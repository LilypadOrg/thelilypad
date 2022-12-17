import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useDAOTreasure } from '~/hooks/useDAOTreasure';
import { formatNumber } from '~/utils/formatters';
import { ethers } from 'ethers';

const GovernanceTreasury = () => {
  const { treasureValue } = useDAOTreasure();
  const fmtTreasureBalance = ethers.utils.formatUnits(
    (treasureValue ?? 0).toString(),
    'ether'
  );
  // const web3: Web3 = new Web3();
  // const fmtTreasureBalance = web3.utils.fromWei(
  //   (treasureValue ?? 0).toString(),
  //   'ether'
  // );
  const [ethUsd, setEthUsd] = useState('');

  useEffect(() => {
    let controller: AbortController;

    function fetchEthUsd() {
      controller = new AbortController();
      axios
        .get('https://api.etherscan.io/api?module=stats&action=ethprice', {
          signal: controller.signal,
        })
        .then((res) => {
          //console.log(res.data.result.ethusd);
          setEthUsd(res.data.result.ethusd);
        });
    }

    fetchEthUsd();

    const interval = setInterval(() => {
      fetchEthUsd();
    }, 60000);
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

  const fmtTreasureBalanceUsd = useMemo(() => {
    let fmtTreasureBalanceUsd;
    if (treasureValue && ethUsd) {
      const treasureBalanceUsd =
        Number(formatNumber(Number(fmtTreasureBalance), 4)) * Number(ethUsd);
      //console.log(value);
      //const treasureBalanceUsd = ethers.utils
      //  .parseUnits(treasureValue.toString(), 'wei')
      //  .mul(biEthUsd)
      //  .div('1'.padEnd(dec + 1, '0'));
      fmtTreasureBalanceUsd = formatNumber(treasureBalanceUsd, 2); //formatEther(treasureBalanceUsd, 2);
      console.log(fmtTreasureBalanceUsd);
    }
    return fmtTreasureBalanceUsd;
  }, [treasureValue, ethUsd, fmtTreasureBalance]);

  return (
    <div>
      <h1>Trasury</h1>
      <h3>Ξ&nbsp;{fmtTreasureBalance}</h3>
      <h4>$&nbsp;{fmtTreasureBalanceUsd}</h4>
      <p>
        This treasury exists for supporting developers of the LilyPad Community
        to build Web3 Projects.
      </p>
    </div>

    // <Container>
    //   <Row className="GovernanceTreasury" ref={ref}>
    //     <Col lg={8} className="treasuryAmount">
    //       <span className="treasuryHeader">Treasury</span>
    //       <Row>
    //         <Col lg={3} className="treasuryEth">
    //           <h3>Ξ&nbsp;{fmtTreasureBalance}</h3>
    //         </Col>
    //         <Col className="treasuryUsd">
    //           <h4>$&nbsp;{fmtTreasureBalanceUsd}</h4>
    //         </Col>
    //       </Row>
    //     </Col>
    //     <Col
    //       className="treasuryInfo"
    //       dangerouslySetInnerHTML={{
    //         __html:
    //           'This treasury exists for supporting developers of the LilyPad Community to build Web3 Projects.',
    //       }}
    //     />
    //   </Row>
    // </Container>
  );
};

// GovernanceTreasury.displayName = 'GovernanceTreasury';

export default GovernanceTreasury;
