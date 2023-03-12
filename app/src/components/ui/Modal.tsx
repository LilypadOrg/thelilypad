import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const hideModal = (e: React.MouseEvent<HTMLElement>) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    },
    [onClose, open]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', keyPress);
      // document.body.style.height = '100vh;';
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', keyPress);
        document.body.style.overflow = 'auto';
      };
    }
  }, [keyPress, open]);

  return open
    ? createPortal(
        // <div
        //   className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-[rgba(0,0,0,0.5)] p-1"
        //   ref={modalRef}
        //   onClick={hideModal}
        // >
        //   <div className="relative mt-20 transform overflow-hidden rounded-sm bg-secondary-400 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
        //     <div className="bg-secondary-400 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div
          className={`fixed inset-0 z-[100] overflow-hidden bg-[rgba(0,0,0,0.5)] p-1`}
          ref={modalRef}
          onClick={hideModal}
        >
          <div className="relative mx-auto mt-20 mb-5 w-full max-w-2xl transform  overflow-auto rounded-sm bg-secondary-400 text-left shadow-xl transition-all">
            <div className=" bg-secondary-400 px-4 py-4 sm:p-6 sm:pb-4">
              {children}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default Modal;
