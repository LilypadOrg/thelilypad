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
import { getFileFromImageUri } from '~/utils/formatters';
import { useEffect } from 'react';

const schema = z.object({
  id: z.number().optional(),
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
  const res = await axios.post('/api/projects/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data as Project;
};

const updateProject = async (data: FormData) => {
  const res = await axios.post('/api/projects/edit', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data as Project;
};

export const useEditProjectForm = (project?: Project) => {
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

  useEffect(() => {
    async function getDefaultValues(project?: Project) {
      if (project) {
        const {
          codeUrl,
          author,
          id,
          content: { title, description, url, coverImageUrl },
        } = project;
        const techs = project.content.technologies.map((t) => t.id);
        const tags = project.content.tags.map((t) => t.id);
        const image = coverImageUrl
          ? await getFileFromImageUri(
              '/images/communityProjects/' + coverImageUrl
            )
          : undefined;

        reset({
          id,
          codeUrl,
          author,
          title,
          tags,
          techs,
          description,
          url,
          image,
        });
      }
    }

    getDefaultValues(project);
  }, [project, reset]);

  // const { mutate, isLoading } = useMutation({
  //   mutationFn: (data: FormData) => createProject(data),
  //   onSuccess: (data) => {
  //     router.replace(`/projects/${data.id}/${data.content.slug}`);
  //   },
  // });

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append('image', data.image);

    formData.append('author', data.author);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('url', data.url);
    data.codeUrl && formData.append('codeUrl', data.codeUrl);
    formData.append('techs', JSON.stringify(data.techs));
    formData.append('tags', JSON.stringify(data.tags));

    // mutate(formData);
    if (data.id) formData.append('id', data.id.toString());
    const resProject = data.id
      ? await updateProject(formData)
      : await createProject(formData);

    router.replace(`/projects/${resProject.id}/${resProject.content.slug}`);
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
