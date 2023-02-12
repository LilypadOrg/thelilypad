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
import axios from 'axios';
import { useRouter } from 'next/router';
import { Project } from '~/types/types';

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
  codeUrl: z.string().url().nullish(),
  techs: z.array(z.number()),
  tags: z.array(z.number()),
  image: z
    .custom<File>()
    .refine((file) => {
      return file;
    }, 'Image is required.')
    .refine((file) => {
      return file && file.size <= MAX_FILE_SIZE;
    }, `Max file size is ${MAX_FILE_SIZE / 1000000} MB.`)
    .refine(
      (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
      `${ACCEPTED_IMAGE_TYPES.join(',')} files are accepted.`
    ),
});

export type EditProjectFormInputs = z.infer<typeof schema>;

// not using TRPC because of file upload
const createProject = async (data: FormData) => {
  const res = await axios.post('/api/projects/edit', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data as Project;
};

export const useEditProjectForm = () => {
  const router = useRouter();

  const { register, handleSubmit, control, formState, reset } =
    useForm<EditProjectFormInputs>({
      mode: 'onTouched',
      resolver: zodResolver(schema),
      defaultValues: {
        techs: [],
        tags: [],
      },
    });

  // const { mutate, isLoading } = useMutation({
  //   mutationFn: (data: FormData) => createProject(data),
  //   onSuccess: (data) => {
  //     router.replace(`/projects/${data.id}/${data.content.slug}`);
  //   },
  // });

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    const image = data.image;
    if (image) {
      formData.append('image', image);
    }
    console.log({ data });

    formData.append('author', data.author);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('url', data.url);
    data.codeUrl && formData.append('codeUrl', data.codeUrl);
    formData.append('techs', JSON.stringify(data.techs));
    formData.append('tags', JSON.stringify(data.tags));

    // mutate(formData);
    const project = await createProject(formData);
    router.replace(`/projects/${project.id}/${project.content.slug}`);
  });

  return {
    handleSubmit,
    register,
    // handleFormSubmit: handleSubmit(onSubmit),
    onSubmit,
    formState,
    control,
    reset,
  };
};
