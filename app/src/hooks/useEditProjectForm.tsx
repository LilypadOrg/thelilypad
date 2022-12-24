import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  PROJECT_NAME_MIN_LENGTH,
  PROJECT_NAME_MAX_LENGTH,
  PROJECT_DESC_MIN_LENGTH,
  PROJECT_DESC_MAX_LENGTH,
} from '~/utils/constants';
import { useRef } from 'react';
import { trpc } from '~/utils/trpc';

export const useEditProjectForm = () => {
  const projectSkills = useRef<number[]>([]);
  const projectTags = useRef<number[]>([]);

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
    image: z.instanceof(FileList),
  });

  type Inputs = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const { isLoading: isSubmitting } = trpc.useMutation(['projects.create']);
  // const { mutate: saveProject, isLoading: isSubmitting } = trpc.useMutation([
  //   'projects.create',
  // ]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    // saveProject({ ...data });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    projectSkills,
    projectTags,
  };
};
