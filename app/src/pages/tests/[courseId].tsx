import type { NextPage } from 'next';
import { trpc } from '~/utils/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TestQuestion from '~/components/TestQuestion';
import { TestFormInputs } from '~/types/types';

const Test: NextPage = () => {
  // TODO: Redirect if unauthorized
  const courseId = Number(useRouter().query.courseId);
  const { data: session } = useSession();
  const { data: course } = trpc.useQuery(['courses.byId', { id: courseId }]);

  const { data: questions } = trpc.useQuery(['tests.filtered'], {
    enabled: !!session,
  });

  const { mutate: createTest } = trpc.useMutation(['tests.createInstance']);
  const { mutate: getTestResults } = trpc.useMutation(['tests.result']);

  const status: 'completed' | 'cooldon' | 'test' | 'loading' | 'create' =
    'loading';

  const schema = z.record(z.string());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestFormInputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const onSubmitButton: SubmitHandler<TestFormInputs> = (data) => {
    const res = getTestResults(data);
    console.log('testResult');
    console.log(res);
  };

  return (
    <div className="px-[5.5rem]">
      <h4>Test for &quot;{course?.content.title}&quot;</h4>
      <form onSubmit={handleSubmit(onSubmitButton)}>
        {questions?.map((q) => (
          <TestQuestion
            key={`q-${q.code}`}
            question={q}
            active={false}
            answerSelected={37}
            answerStatus={true}
            error={!!errors[`${q.id}`]}
            registerField={register}
          />
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Test;
