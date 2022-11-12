import React, { useState, useEffect, useRef } from 'react';

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

const CountDown = ({
  startValue,
  handleOver,
  classes = '',
}: {
  startValue: number;
  handleOver: () => void;
  classes: string;
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(startValue);
  const [status, setStatus] = useState<string>(STATUS.STARTED);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        setStatus(STATUS.STOPPED);
        handleOver();
      }
    },
    1000,
    status === STATUS.STOPPED
  );
  return (
    <div className={classes}>
      {twoDigits(hoursToDisplay)}:{twoDigits(minutesToDisplay)}:
      {twoDigits(secondsToDisplay)}
    </div>
  );
};

export default CountDown;

// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: number, stop: boolean) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (!stop) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, stop]);
}

// https://stackoverflow.com/a/2998874/1673761
const twoDigits = (num: number) => String(num).padStart(2, '0');
