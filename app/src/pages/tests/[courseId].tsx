import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { TestFormInputs, TestInstanceExt } from '~/types/types';
import {
  TEST_DURATION_MS,
  TEST_PASS_RATE,
  TEST_QUESTIONS_BY_LEVEL,
  TEST_SHOW_RESULT_MS,
} from '~/utils/constants';
import { getCourseHighestLevel } from '~/utils/content';
import CountDown from '~/components/CountDown';
import TestForm from '~/components/TestForm';
import { SubmitHandler } from 'react-hook-form';

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
      onSuccess: (data) => {
        console.log('Exist succes');
        setCurrentTest(data);
      },
    }
  );

  const { mutate: createTest } = trpc.useMutation(['tests.createInstance'], {
    onSuccess: (data) => {
      console.log('New succes');

      setTestState('edit');
      setCurrentTest(data);
    },
  });

  const { mutate: getTestResults } = trpc.useMutation(['tests.result'], {
    onSuccess: (data) => {
      console.log('Result succes');
      setCurrentTest(data);
      if (data.isPassed) {
        setTestState('passed');
      } else setTestState('cooldown');
    },
  });

  const [testState, setTestState] = useState<
    'create' | 'edit' | 'cooldown' | 'loading' | 'passed'
  >('loading');

  const [currentTest, setCurrentTest] = useState<TestInstanceExt | null>();

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

  // const currentTest = testResults || newTest || existingTest;

  const showTest =
    currentTest &&
    (testState === 'edit' ||
      ((testState === 'cooldown' || testState === 'passed') &&
        currentTest.isSubmitted &&
        currentTest.expiredOn &&
        new Date().getTime() - currentTest.expiredOn.getTime() <
          TEST_SHOW_RESULT_MS));

  const courseLevel = course ? getCourseHighestLevel(course.levels) : undefined;
  const totalQuestions = courseLevel ? TEST_QUESTIONS_BY_LEVEL[courseLevel] : 0;

  const resultStats =
    currentTest && currentTest.isSubmitted
      ? {
          total: currentTest.questions.length,
          correct: currentTest.questions.filter((q) => q.givenAnswer?.correct)
            .length,
        }
      : undefined;

  const submitTest: SubmitHandler<TestFormInputs> = (data) => {
    if (!currentTest) return;
    console.log('Submit values');
    console.log(data);
    const submitData = {
      testId: currentTest.id,
      answers: data,
    };
    getTestResults(submitData);
  };

  const createNewTest = () => {
    createTest({ courseId });
  };

  const handleCoolDownOver = () => {
    setTestState('create');
  };

  return (
    <div className="px-[5.5rem]">
      {course && (
        <>
          <h4>Test for &quot;{course.content.title}&quot;</h4>
          {testState === 'create' && (
            <div>
              <p>
                Test for this course will constitute of {totalQuestions}{' '}
                questions on{' '}
                {course.content.technologies.map((l) => l.name).join(', ')}.
              </p>
              <p>
                You are going to have {TEST_DURATION_MS / 1000 / 60} minutes to
                complete the test.
              </p>
              <button
                className="mt-8 w-full rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
                onClick={createNewTest}
              >
                Start Test
              </button>
            </div>
          )}
          {(testState === 'passed' || testState === 'cooldown') && currentTest && (
            <div>
              <div className="mb-4 text-4xl font-bold">
                <p>
                  Test{' '}
                  {testState === 'passed' ? (
                    <span className="text-green-600">passed!!!</span>
                  ) : (
                    <span className="text-red-600">failed!</span>
                  )}
                </p>
                <div>
                  You can retry in{' '}
                  <CountDown
                    classes="inline"
                    startValue={Math.floor(currentTest.coolDownTime / 1000)}
                    handleOver={handleCoolDownOver}
                  />
                </div>
              </div>

              {resultStats && (
                <div className="text-xl">
                  <p>
                    Total questions: {resultStats.total} - Correct Answers:{' '}
                    {resultStats.correct} - Correct:{' '}
                    {(resultStats.correct / resultStats.total) * 100}%
                  </p>
                  <p>
                    You need {TEST_PASS_RATE * 100}% correct answers to pass the
                    test.
                  </p>
                </div>
              )}
            </div>
          )}

          {showTest && <TestForm submitTest={submitTest} test={currentTest} />}
        </>
      )}
    </div>
  );
};

export default Test;
