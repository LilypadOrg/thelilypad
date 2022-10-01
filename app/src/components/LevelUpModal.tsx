import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { useConfetti } from '~/hooks/useConfetti';

const LevelUpModal = ({
  open,
  closeModal,
  prevSBT,
  currSBT,
  reachedLevel,
}: {
  open: boolean;
  closeModal: () => void;
  prevSBT: string;
  currSBT: string;
  reachedLevel: number;
}) => {
  const modalRef = useRef(null);
  const [sbtVisibility, setSbtVisibility] = useState<{
    prev: boolean;
    curr: boolean;
  }>({ prev: true, curr: false });

  const { fireCelebration, getConfettiInstance } = useConfetti();

  const hideModal = (e: React.MouseEvent<HTMLElement>) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeModal();
      }
    },
    [closeModal, open]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setSbtVisibility({ prev: false, curr: true });
        fireCelebration();
      }, 1000);
      // setPrevSBTVisibile(false);
      // setCurrSBTVisibile(true);
    }
  }, [open]);

  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-[rgba(0,0,0,0.5)] p-1"
      ref={modalRef}
      onClick={hideModal}
    >
      <ReactCanvasConfetti
        className="pointer-events-none fixed top-0 left-0 z-[1000] h-full w-full"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next-line
        refConfetti={getConfettiInstance}
      />
      <div className="min animate-fade-in-down relative  w-[450px]  rounded-2xl bg-secondary-400 p-5">
        <div className="flex flex-col items-center justify-center gap-4 text-gray-800">
          <div>
            <p className="text-center text-xl font-bold">Levelling up!</p>
            <p className="text-center text-lg font-bold">
              Congratulations! <span className="text-3xl">🎉</span>
            </p>
          </div>
          {/* <button
            onClick={() => {
              setPrevSBTVisibile(!prevSBTVisibile);
              setCurrSBTVisibile(!currSBTVisibile);
            }}
          >
            test
          </button> */}
          <div className="relative h-[400px] w-[400px] rounded-lg border-4 border-black ">
            <div
              className={`absolute top-0 left-0 h-[405px]  ${
                sbtVisibility.prev ? 'opacity-100' : 'opacity-0'
              }   transition-opacity delay-[1000ms] duration-[3000ms]`}
            >
              <Image
                loader={() => prevSBT}
                src={prevSBT}
                alt="Previous SBT"
                layout="intrinsic"
                width="400px"
                height="400px"
                className=""
              />
            </div>
            <div
              className={`absolute top-0 left-0 ${
                sbtVisibility.curr ? 'opacity-100' : 'opacity-0'
              } transition-opacity delay-[1000ms] duration-[3000ms]`}
            >
              <Image
                loader={() => currSBT}
                src={currSBT}
                alt="Previous SBT"
                layout="intrinsic"
                width="400px"
                height="400px"
              />
            </div>
          </div>
          <p className="text text-center font-semibold">
            You advanced from level {reachedLevel - 1} to level {reachedLevel}
          </p>
        </div>

        <span
          className="absolute top-0 right-0 cursor-pointer rounded-full pt-2 pr-5 text-xl font-bold"
          onClick={closeModal}
        >
          &times;
        </span>
      </div>
    </div>
  );
};

export default LevelUpModal;
