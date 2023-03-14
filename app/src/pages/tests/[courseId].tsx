import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
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
import { CompleteCourse } from '~/components/CompleteCourse';

const Test: NextPage = () => {
  // TODO: Redirect if unauthorized
  const router = useRouter();
  const courseId = Number(router.query.courseId);

  const { data: session, status: sessionStatus } = useSession();
  const { data: course } = api.courses.byId.useQuery({ id: courseId });

  const userCourse =
    course?.userCourses.length === 1 ? course?.userCourses[0] : undefined;

  const { data: existingTest, isLoading: isLoadingExisting } =
    api.tests.single.useQuery(
      { courseId },
      {
        enabled: !!session && !!courseId,
        onSuccess: (data) => {
          setCurrentTest(data);
        },
      }
    );

  const { mutate: createTest } = api.tests.createInstance.useMutation({
    onSuccess: (data) => {
      setTestState('edit');
      setCurrentTest(data);
    },
  });

  const { mutate: getTestResults } = api.tests.result.useMutation({
    onSuccess: (data) => {
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
      {course && session?.user && (
        <>
          <h4>Test for &quot;{course.content.title}&quot;</h4>
          {testState === 'create' && (
            <div>
              <p>
                Test for this course will constitute of{' '}
                <span className="font-bold">{totalQuestions} questions</span> on{' '}
                <span className="font-bold">
                  {course.content.technologies.map((l) => l.name).join(', ')}
                </span>
                .
              </p>
              <p>
                You are going to have{' '}
                <span className="font-bold">
                  {TEST_DURATION_MS / 1000 / 60} minutes
                </span>{' '}
                to complete the test.
              </p>
              <button
                className="mt-8 rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
                onClick={createNewTest}
              >
                Start Test
              </button>
            </div>
          )}
          {(testState === 'passed' || testState === 'cooldown') &&
            currentTest && (
              <div>
                {(testState === 'passed' || testState === 'cooldown') && (
                  <div className="mb-4  ">
                    <p className="text-4xl font-bold">
                      {testState === 'passed' ? (
                        <span className="text-green-600">Test passed 🎉</span>
                      ) : (
                        <span className="text-red-600">Test failed 😭</span>
                      )}
                    </p>
                    {testState === 'cooldown' && (
                      <div>
                        You can retry in{' '}
                        <CountDown
                          classes="inline"
                          startValue={Math.floor(
                            currentTest.coolDownTime / 1000
                          )}
                          handleOver={handleCoolDownOver}
                        />
                      </div>
                    )}
                    {resultStats && (
                      <div className="text-xl">
                        <p>
                          Total questions:{' '}
                          <span className="font-bold">{resultStats.total}</span>{' '}
                          - Correct Answers:{' '}
                          <span className="font-bold">
                            {resultStats.correct}
                          </span>{' '}
                          - Correct:{' '}
                          <span className="font-bold">
                            {(resultStats.correct / resultStats.total) * 100}%
                          </span>
                        </p>
                        <p>
                          You need {TEST_PASS_RATE * 100}% correct answers to
                          pass the test.
                        </p>
                      </div>
                    )}
                    {testState === 'passed' && (
                      <CompleteCourse
                        courseId={courseId}
                        completed={userCourse?.completed || false}
                        user={session.user}
                      />
                    )}
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
