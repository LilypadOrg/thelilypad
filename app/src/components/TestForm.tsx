import { zodResolver } from '@hookform/resolvers/zod';
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

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<TestFormInputs>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const handleExpiration = () => {
    console.log('Expire values');
    console.log(getValues());
    submitTest(getValues());
  };

  console.log('test');
  console.log(test);

  return (
    <>
      <button onClick={handleExpiration}>Expire</button>

      <div className="flex">
        <div className="flex-1">
          <form onSubmit={handleSubmit(submitTest)}>
            {test.questions.map((q, i) => (
              <TestQuestion
                key={`q-${q.question.code}`}
                sequenceNumber={i + 1}
                question={q.question}
                disabled={test.isExpired}
                answerSelected={q.givenAnswer?.id}
                answerStatus={q.givenAnswer?.correct}
                error={!!errors[`${q.question.id}`]}
                registerField={register}
              />
            ))}
            <button disabled={test.isExpired} type="submit">
              Submit
            </button>
          </form>
        </div>
        {!test.isExpired && (
          <div className="relative">
            <div className="sticky left-10 top-20 text-right text-3xl font-bold text-red-600">
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
