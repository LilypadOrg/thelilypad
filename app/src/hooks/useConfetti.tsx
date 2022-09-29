import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateTypes } from 'canvas-confetti';

export const useConfetti = () => {
  function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  const refAnimationInstance = useRef<CreateTypes | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const getConfettiInstance = useCallback((confetti: CreateTypes) => {
    refAnimationInstance.current = confetti;
  }, []);

  function getAnimationSettings(originXA: number, originXB: number) {
    return {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount: 150,
      colors: [
        '#0fc6fd',
        '#9844fd',
        '#fe4e71',
        '#70ff37',
        '#f8fb2b',
        '#f79916',
        '#fc1dfc',
      ],
      origin: {
        x: randomInRange(originXA, originXB),
        y: Math.random() - 0.2,
      },
    };
  }

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
      refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
    }
  }, []);

  const stopAnimation = useCallback(() => {
    clearInterval(intervalId?.toString());
    setIntervalId(null);
    refAnimationInstance.current && refAnimationInstance.current.reset();
  }, [intervalId]);

  const startAnimation = useCallback(() => {
    if (!intervalId) {
      setIntervalId(window.setInterval(nextTickAnimation, 400));
      setTimeout(stopAnimation, 4000);
    }
  }, [intervalId, nextTickAnimation, stopAnimation]);

  useEffect(() => {
    return () => {
      clearInterval(intervalId?.toString());
    };
  }, [intervalId]);

  const fireCelebration = () => {
    startAnimation();
  };

  return { fireCelebration, getConfettiInstance };
};
