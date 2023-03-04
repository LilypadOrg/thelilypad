import { trpc } from '~/utils/trpc';
import PillSelector from '~/components/PillSelector';
import SpinningCircle from '~/components/ui/Loaders/SpinningCircle';
import { useEditProjectForm } from '~/hooks/useEditProjectForm';
import TextInput from '~/components/ui/form/TextInput';
import TextAreaInput from '~/components/ui/form/TextAreaInput';
import ImageInput from '~/components/ui/form/ImageInput';
import { Controller } from 'react-hook-form';
import Button from '~/components/ui/Button';
import { Project } from '~/types/types';

const EditProjectForm = ({ project }: { project?: Project }) => {
  const {
    onSubmit,
    register,
    formState: { isSubmitting, errors, isValid },
    control,
  } = useEditProjectForm(project);

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
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange, value } }) => (
                  <ImageInput
                    name="image"
                    error={errors.image}
                    label="Upload Image"
                    image={value}
                    setImage={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="techs"
                render={({ field: { onChange, value } }) => (
                  <PillSelector
                    label="Technologies"
                    options={tagOptions}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="tags"
                render={({ field: { onChange, value } }) => (
                  <PillSelector
                    label="Tags"
                    options={techOptions}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>
            <div className="bg-transparent px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? (
                  <>
                    <SpinningCircle />
                    Saving...
                  </>
                ) : (
                  'Save Project'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProjectForm;
