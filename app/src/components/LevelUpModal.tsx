import { useCallback, useEffect, useRef } from 'react';

const LevelUpModal = ({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) => {
  const modalRef = useRef(null);

  const hideModal = (e: React.MouseEvent<HTMLElement>) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeModal();
        console.log('Esc pressed');
      }
    },
    [closeModal, open]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);

  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-[rgba(0,0,0,0.5)] p-1"
      ref={modalRef}
      onClick={hideModal}
    >
      <div className="min animate-fade-in-down relative w-7/12 rounded-2xl bg-secondary-400 p-5">
        <div className="flex flex-row items-center space-x-4 text-gray-800">
          Levelling up!
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
