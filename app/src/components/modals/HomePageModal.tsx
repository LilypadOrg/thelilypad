import React from 'react';
import { Dialog } from '@headlessui/react';
import Modal from './Modal';

const HomePageModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal open={open} setOpen={setOpen}>
      <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-secondary-300 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div>I am a modal</div>
      </Dialog.Panel>
    </Modal>
  );
};

export default HomePageModal;
