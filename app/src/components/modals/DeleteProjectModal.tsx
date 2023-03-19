import React from 'react';
import { Dialog } from '@headlessui/react';
import { BsExclamationTriangle } from 'react-icons/bs';
import Modal from './Modal';
import { api } from '~/utils/api';
import Spinner from '../ui/Spinner';
import { Project } from '~/types/types';

const DeleteProjectModal = ({
  open,
  setOpen,
  project,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project | undefined;
}) => {
  const utils = api.useContext();

  const { mutate: executeDelete, isLoading } = api.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.all.invalidate();
      setOpen(false);
    },
  });

  const deleteProject = () => {
    if (project) {
      executeDelete(project.id);
    }
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-secondary-300 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div className="flex gap-x-2">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <BsExclamationTriangle
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Delete Project
              </Dialog.Title>
            </div>

            <div className="mt-2">
              <p className="text-sm ">
                Are you sure you want to delete the community project &quot;
                {project?.content.title}&quot;? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-secondary-400 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          {!isLoading && (
            <>
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={deleteProject}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </>
          )}
          <div className="flex justify-center">
            {isLoading && <Spinner bgColor="gray-400" color="white" />}
          </div>
        </div>
      </Dialog.Panel>
    </Modal>
  );
};

export default DeleteProjectModal;
