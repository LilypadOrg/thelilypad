import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  PROJECT_NAME_MIN_LENGTH,
  PROJECT_NAME_MAX_LENGTH,
  PROJECT_DESC_MIN_LENGTH,
  PROJECT_DESC_MAX_LENGTH,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from '~/utils/constants';
import { useRef } from 'react';
import { trpc } from '~/utils/trpc';
import axios from 'axios';

const schema = z.object({
  author: z
    .string()
    .min(PROJECT_NAME_MIN_LENGTH, {
      message: `Author name must be at least ${PROJECT_NAME_MIN_LENGTH} characters`,
    })
    .max(PROJECT_NAME_MAX_LENGTH, {
      message: `Author name can be maximum ${PROJECT_NAME_MAX_LENGTH} characters`,
    }),
  title: z
    .string()
    .min(PROJECT_NAME_MIN_LENGTH, {
      message: `Project name must be at least ${PROJECT_NAME_MIN_LENGTH} characters`,
    })
    .max(PROJECT_NAME_MAX_LENGTH, {
      message: `Project name can be maximum ${PROJECT_NAME_MAX_LENGTH} characters`,
    }),
  description: z
    .string()
    .min(PROJECT_DESC_MIN_LENGTH, {
      message: `Description must be at least ${PROJECT_DESC_MIN_LENGTH} characters`,
    })
    .max(PROJECT_DESC_MAX_LENGTH, {
      message: `Description can be maximum ${PROJECT_NAME_MAX_LENGTH} characters`,
    }),
  url: z.string().url(),
  codeUrl: z.string().url().optional(),
  image: z
    .custom<FileList>()
    .refine((files) => files.length === 1, 'Image is required.') // if no file files?.length === 0, if file files?.length === 1
    .refine((files) => {
      console.log(files?.[0]?.size);
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max file size is ${MAX_FILE_SIZE / 1000000} MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      `${ACCEPTED_IMAGE_TYPES.join(',')} files are accepted.`
    ),
});

export type EditProjectFormInputs = z.infer<typeof schema>;

export const useEditProjectForm = () => {
  const projectTechs = useRef<number[]>([]);
  const projectTags = useRef<number[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditProjectFormInputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  // const { handleSubmit, ...metods } = useForm<EditProjectFormInputs>({
  //   mode: 'onTouched',
  //   resolver: zodResolver(schema),
  // });

  const { isLoading: isSubmitting } = trpc.useMutation(['projects.create']);
  // const { mutate: saveProject, isLoading: isSubmitting } = trpc.useMutation([
  //   'projects.create',
  // ]);

  // const onSubmit: SubmitHandler<EditProjectFormInputs> = (data) => {
  //   console.log('form data');
  //   console.log(data);
  //   // saveProject({ ...data });
  // };

  const onSubmit = handleSubmit(async (data) => {
    console.log('form data');
    console.log(data);
    const formData = new FormData();
    const image = data.image.item(0);
    if (image) {
      formData.append('image', image);
    }

    formData.append('author', data.author);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('url', data.url);
    data.codeUrl && formData.append('codeUrl', data.codeUrl);
    formData.append('techs', JSON.stringify(projectTechs.current));
    formData.append('tags', JSON.stringify(projectTags.current));

    // saveProject({ ...data });
    await axios.post('/api/projects/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  });

  return {
    handleSubmit,
    register,
    // handleFormSubmit: handleSubmit(onSubmit),
    onSubmit,
    errors,
    isSubmitting,
    projectSkills: projectTechs,
    control,
    projectTags,
  };
};
