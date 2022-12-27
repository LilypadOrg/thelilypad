import { trpc } from '~/utils/trpc';
import PillSelector from './SkillSelector';
import Modal from './ui/Modal';
import SpinningCircle from './ui/Loaders/SpinningCircle';
import { useEditProjectForm } from '~/hooks/useEditProjectForm';
import TextInput from './ui/form/TextInputOld';
import TextAreaInput from './ui/form/TextAreaInput';
import ImageInput from './ui/form/ImageInput';

const EditProjectModal = ({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    projectSkills,
    projectTags,
  } = useEditProjectForm();

  const { data: techs } = trpc.useQuery(['technologies.all']);
  const techOptions = techs?.map((t) => ({ value: t.id, label: t.name })) || [];

  const { data: tags } = trpc.useQuery(['tags.all']);
  const tagOptions = tags?.map((t) => ({ value: t.id, label: t.name })) || [];

  return (
    <Modal onClose={closeModal} open={open}>
      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3
          className="text-lg font-medium leading-6 text-gray-900"
          id="modal-title"
        >
          Add Project
        </h3>
        <div className="mt-2">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <TextInput
                label="Author"
                error={errors.author}
                register={register('author')}
              />
              <TextInput
                label="Title"
                error={errors.title}
                register={register('title')}
              />
              <TextAreaInput
                label="Description"
                error={errors.description}
                register={register('description')}
              />
              <TextInput
                label="URL"
                error={errors.url}
                register={register('url')}
              />
              <ImageInput
                register={register('image')}
                error={errors.image}
                label="Cover Image"
              />
              <PillSelector
                label="Technologies"
                selectedOptions={projectSkills}
                options={techOptions}
              />
              <PillSelector
                label="Tags"
                selectedOptions={projectTags}
                options={tagOptions}
              />
            </div>
            <div className="bg-transparent px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className={`inline-flex w-full justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                  isSubmitting && 'cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <SpinningCircle />
                    Saving profile
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
              <button
                onClick={closeModal}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditProjectModal;
