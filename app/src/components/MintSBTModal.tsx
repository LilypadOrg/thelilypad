// import ContractWriteFn from 'wagmi/dist/declarations/src/hooks//contracts/useContractWrite';

import Image from 'next/image';
import React, { useCallback, useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { SBT_MINT_FEE } from '~/utils/constants';
import { getLilyPadABI, getLilyPadAddress } from '~/utils/contracts';
import { trpc } from '~/utils/trpc';

const MintSBTModal = ({
  open,
  closeModal,
  address,
}: {
  open: boolean;
  closeModal: (isSuccess: boolean) => void;
  address: string;
}) => {
  const utils = trpc.useContext();

  const { config: mintTokenConfig } = usePrepareContractWrite({
    address: getLilyPadAddress(),
    abi: getLilyPadABI(),
    functionName: 'mintTokenForMember',
    args: [address as `0x${string}`],
    overrides: {
      value: SBT_MINT_FEE,
    },
  });

  const { data: mintTokenRes, write: mintToken } =
    useContractWrite(mintTokenConfig);

  const { mutateAsync: upadteHasPondSBT } = trpc.useMutation([
    'users.setHasPondSBT',
  ]);

  const { isLoading: isLoadingMintToken } = useWaitForTransaction({
    hash: mintTokenRes?.hash,
    onSuccess: async () => {
      const user = await upadteHasPondSBT({ hasPondSBT: true });
      utils.refetchQueries(['users.byAddress', { address: user.address }]);
      utils.refetchQueries(['users.byUsername', { username: user.username }]);

      closeModal(true);
    },
  });

  const handleMint = () => {
    if (mintToken) {
      mintToken();
    }
  };

  const modalRef = useRef(null);

  const hideModal = (e: React.MouseEvent<HTMLElement>) => {
    if (modalRef.current === e.target) {
      closeModal(false);
    }
  };

  const keyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeModal(false);
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
          <Tilt>
            <div className="flex items-center justify-center rounded-xl bg-black p-2 shadow-2xl">
              <Image
                src={'/images/profileSBT/level1.jpg'}
                alt={'nft'}
                width="700"
                height="700"
                className="cursor-pointer rounded-xl"
              />
            </div>
          </Tilt>

          <div className="p-1">
            <p className="mb-3 text-2xl font-bold text-primary-600">
              POND Token
            </p>
            <p className="m-0 mb-4 rounded-md bg-secondary-300 p-3">
              <span className="font-bold">What is a Soulbound Token?</span>{' '}
              <br /> Soulbound Tokens are special NFTs which cannot be traded,
              only burned. They are yours and yours alone, a reflection of your
              journey.
            </p>
            <p className="m-0 mb-4 rounded-md bg-secondary-300 p-3">
              <span className="font-bold"> Why mint an SBT?</span> <br /> A Lily
              Pad Pond Token gives users a dynamic and exciting way to track
              their progress as they learn. This token will evolve as you do and
              reflect your accomplishments as a developer!
            </p>
            <p className="m-0 mb-4 rounded-md bg-secondary-300 p-3">
              <span className="font-bold"> Why a mint fee?</span> <br /> Our
              goal is provide an avenue through which developers can seek
              funding for their projects and The Lily Pad treasury, funded by
              SBT tokens will be how this is achieved!
            </p>
            <button
              type="submit"
              disabled={!mintToken}
              onClick={handleMint}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isLoadingMintToken ? 'Minting...' : 'Mint SBT'}
            </button>
          </div>
        </div>
        <span
          className="absolute top-0 right-0 cursor-pointer rounded-full pt-2 pr-5 text-xl font-bold"
          onClick={hideModal}
        >
          &times;
        </span>
      </div>
    </div>
  );
};

export default MintSBTModal;

//  <div
//       className="relative z-10"
//       aria-labelledby="modal-title"
//       role="dialog"
//       aria-modal="true"
//     >
//       {/* Background backdrop, show/hide based on modal state. */}
//       <div
//         className={`${
//           open ? 'fixed' : 'hidden'
//         } inset-0 bg-gray-500 bg-opacity-75 transition-opacity`}
//       ></div>

//       <div
//         className={`${open ? 'fixed' : 'hidden'} inset-0 z-10 overflow-y-auto`}
//       >
//         <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//           {/* Modal panel, show/hide based on modal state. */}
//           <div className="relative transform overflow-hidden rounded-sm bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
//             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//               <div className="sm:flex sm:items-start">
//                 <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                   <h3
//                     className="text-lg font-medium leading-6 text-gray-900"
//                     id="modal-title"
//                   >
//                     Mint your SBT
//                   </h3>
//                   <div className="mt-2">
//                     <div>Text</div>
//                     <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//                       <button
//                         type="submit"
//                         disabled={!mintFunction}
//                         onClick={handleMint}
//                         className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
//                       >
//                         {mintIsLoading ? 'Minting...' : 'Mint SBT'}
//                       </button>
//                       <button
//                         onClick={closeModal}
//                         type="button"
//                         className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
