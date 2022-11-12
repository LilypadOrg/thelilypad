import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TestQuestion from '~/components/TestQuestion';
import { TestFormInputs } from '~/types/types';
import { TEST_SHOW_RESULT_MS } from '~/utils/constants';

const Test: NextPage = () => {
  // TODO: Redirect if unauthorized
  const router = useRouter();
  const courseId = Number(router.query.courseId);

  const { data: session, status: sessionStatus } = useSession();
  const { data: course } = trpc.useQuery(['courses.byId', { id: courseId }]);
  const { data: existingTest, isLoading: isLoadingExisting } = trpc.useQuery(
    ['tests.single', { courseId }],
    {
      enabled: !!session && !!courseId,
    }
  );

  const { data: newTest, mutate: createTest } = trpc.useMutation(
    ['tests.createInstance'],
    {
      onSuccess: () => {
        setTestState('edit');
      },
    }
  );

  const { data: testResults, mutate: getTestResults } = trpc.useMutation(
    ['tests.result'],
    {
      onSuccess: (data) => {
        if (data.isPassed) {
          setTestState('passed');
        } else setTestState('cooldown');
      },
    }
  );

  const [testState, setTestState] = useState<
    'create' | 'edit' | 'cooldown' | 'loading' | 'passed'
  >('loading');

  const schema = z.record(z.string());

  useEffect(() => {
    console.log('use effect');
    if (isLoadingExisting) return;

    if (!existingTest) {
      setTestState('create');
    } else {
      if (!existingTest.isExpired) {
        setTestState('edit');
      } else if (existingTest.isPassed) {
        setTestState('passed');
      } else if (!existingTest.isCoolDownOver) {
        setTestState('cooldown');
      } else {
        setTestState('create');
      }
    }
  }, [existingTest, isLoadingExisting]);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.replace('/');
    }
  }, [sessionStatus, router]);

  const currentTest = testResults || newTest || existingTest;
  const showTest =
    currentTest &&
    (testState === 'edit' ||
      (testState === 'cooldown' &&
        currentTest.isSubmitted &&
        currentTest.expiredOn &&
        new Date().getTime() - currentTest.expiredOn.getTime() <
          TEST_SHOW_RESULT_MS));

  console.log('testState');
  console.log(testState);

  console.log('currentTest');
  console.log(currentTest);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestFormInputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const submitTest: SubmitHandler<TestFormInputs> = (data) => {
    if (!currentTest) return;
    const submitData = {
      testId: currentTest.id,
      answers: data,
    };
    getTestResults(submitData);
  };

  const createNewTest = () => {
    createTest({ courseId });
  };

  return (
    <div className="px-[5.5rem]">
      {course && (
        <>
          <h4>Test for &quot;{course.content.title}&quot;</h4>
          {testState === 'create' && (
            <div>
              <p>
                Test for this course will constitute of question on{' '}
                {course.content.technologies.map((l) => l.name).join(', ')}.
              </p>
              <p>You are going to have X minutes to complete the test.</p>
              <button
                className="mt-8 w-full rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
                onClick={createNewTest}
              >
                Start Test
              </button>
            </div>
          )}
          {testState === 'passed' && <div>Test passed!!!</div>}
          {testState === 'cooldown' && <div>Test failed!!!</div>}
          {showTest && (
            <div>
              <form onSubmit={handleSubmit(submitTest)}>
                {currentTest.questions.map((q) => (
                  <TestQuestion
                    key={`q-${q.question.code}`}
                    question={q.question}
                    disabled={currentTest.isExpired}
                    answerSelected={q.givenAnswer?.id}
                    answerStatus={q.givenAnswer?.correct}
                    error={!!errors[`${q.question.id}`]}
                    registerField={register}
                  />
                ))}
                <button disabled={currentTest.isExpired} type="submit">
                  Submit
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Test;
