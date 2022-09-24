const LevelUpModal = ({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background backdrop, show/hide based on modal state. */}
      <div
        className={`${
          open ? 'fixed' : 'hidden'
        } inset-0 bg-gray-500 bg-opacity-75 transition-opacity`}
      ></div>

      <div
        className={`${open ? 'fixed' : 'hidden'} inset-0 z-10 overflow-y-auto`}
      >
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Modal panel, show/hide based on modal state. */}
          <div className="relative transform overflow-hidden rounded-lg bg-secondary-400 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            Modal
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
