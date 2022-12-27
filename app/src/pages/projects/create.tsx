import { NextPage } from 'next';
import { trpc } from '~/utils/trpc';
import PillSelector from '~/components/SkillSelector';
import SpinningCircle from '~/components/ui/Loaders/SpinningCircle';
import { useEditProjectForm } from '~/hooks/useEditProjectForm';
import TextInput from '~/components/ui/form/TextInput';
import TextAreaInput from '~/components/ui/form/TextAreaInput';
import ImageInput from '~/components/ui/form/NewImageInput';
import { FormInput } from '~/components/ui/form/FormInput';

const CreateProjectPage: NextPage = () => {
  const {
    onSubmit,
    isSubmitting,
    register,
    projectSkills,
    projectTags,
    errors,
  } = useEditProjectForm();

  const { data: techs } = trpc.useQuery(['technologies.all']);
  const techOptions = techs?.map((t) => ({ value: t.id, label: t.name })) || [];

  const { data: tags } = trpc.useQuery(['tags.all']);
  const tagOptions = tags?.map((t) => ({ value: t.id, label: t.name })) || [];

  return (
    <div>
      <div className="gradient-bg-top-course px-[5.5rem]">
        <div className="flex flex-col py-8 ">
          <h1 className="mb-4 text-4xl font-bold">Add Project</h1>
        </div>

        <div className="mt-2">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-4">
              <TextInput {...register('author')} error={errors.author} />
              <TextInput {...register('title')} error={errors.title} />
              <TextInput
                {...register('url')}
                label="Project URL"
                error={errors.url}
              />
              <TextAreaInput
                {...register('description')}
                error={errors.description}
              />
              <ImageInput
                name="image"
                error={errors.image}
                label="Cover Image"
                register={register}
              />
              <FormInput
                id="title"
                name="title"
                register={register}
                error={errors.title}
              />
              {/* <TextInput name="author" />
                <TextInput name="title" />
                {/* <TextAreaInput label="Description" error={errors.description} /> */}
              {/* <TextInput name="URL" /> 
                <ImageInput
                  name="image"
                  error={errors.image}
                  label="Cover Image"
                /> */}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
