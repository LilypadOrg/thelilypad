import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { TestFormInputs, TestInstanceExt } from '~/types/types';
import CountDown from './CountDown';
import TestQuestion from './TestQuestion';

const TestForm = ({
  submitTest,
  test,
}: {
  submitTest: SubmitHandler<TestFormInputs>;
  test: TestInstanceExt;
}) => {
  const schema = z.record(z.string());
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    trigger,
    formState: { isValid, isDirty },
  } = useForm<TestFormInputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const subscription = watch((value, { type }) => {
      if (type === 'change') {
        let found = false;

        for (let i = questionIndex + 1; i < test.questions.length; i++) {
          if (!getValues()[test.questions[i].question.id]) {
            setQuestionIndex(i);
            found = true;
            break;
          }
        }
        if (!found) {
          for (let i = 0; i < questionIndex; i++) {
            if (!getValues()[test.questions[i].question.id]) {
              setQuestionIndex(i);
              found = true;
              break;
            }
          }
        }
        if (!found) {
          trigger();
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, questionIndex, getValues, trigger, test.questions]);

  const handleExpiration = () => {
    submitTest(getValues());
  };

  const getQuestionBgColor = (
    index: number,
    id: number,
    isSubmitted: boolean,
    correct: boolean
  ) => {
    let bgColor = '';
    if (questionIndex === index) {
      bgColor = 'bg-secondary-400';
    } else if (isSubmitted) {
      if (correct) {
        bgColor = 'bg-green-300';
      } else {
        bgColor = 'bg-red-300';
      }
    } else if (getValues()[id]) {
      bgColor = 'bg-primary-300';
    }
    return bgColor;
  };

  return (
    <>
      {/* <button onClick={handleExpiration}>Expire</button> */}

      <div className="my-8">
        {test.questions.map((q, i) => {
          const bgColor = getQuestionBgColor(
            i,
            q.question.id,
            test.isSubmitted,
            q.givenAnswer?.correct || false
          );

          return (
            <button
              key={`navigate-q-${i}`}
              onClick={() => {
                setQuestionIndex(i);
              }}
              className={`mx-1 rounded-sm border-2 border-secondary-500 p-2 ${bgColor}`}
            >
              {(i + 1).toString().padStart(2, '0')}
            </button>
          );
        })}
      </div>

      <div className="flex">
        <div className="flex-1">
          <form onSubmit={handleSubmit(submitTest)}>
            <div className="relative">
              {test.questions.map((q, i) => (
                <div
                  key={`q-${q.question.code}`}
                  className={` ${i === questionIndex ? 'block' : 'hidden'}`}
                >
                  <TestQuestion
                    sequenceNumber={i + 1}
                    question={q.question}
                    disabled={test.isExpired}
                    answerSelected={q.givenAnswer?.id}
                    answerStatus={q.givenAnswer?.correct}
                    registerField={register}
                  />
                </div>
              ))}
            </div>
            {!test.isSubmitted && (
              <button
                className="mt-8 rounded-[6.5px] bg-primary-400 px-10 py-2 font-bold text-white disabled:bg-gray-500"
                disabled={test.isExpired || !isDirty || !isValid}
                type="submit"
              >
                Submit Test
              </button>
            )}
          </form>
        </div>
        {!test.isExpired && (
          <div className="relative">
            <div className="sticky left-10 top-20 text-right text-3xl font-bold text-secondary-400">
              Time left
              <CountDown
                classes=""
                startValue={Math.floor(test.expiryTime / 1000)}
                handleOver={handleExpiration}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TestForm;
