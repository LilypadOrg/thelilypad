import { UseFormRegister } from 'react-hook-form';
import { Question, TestFormInputs } from '~/types/types';

const TestQuestion = ({
  question,
  active,
  registerField,
  error,
  answerSelected,
  answerStatus,
}: {
  question: Question;
  active: boolean;
  registerField: UseFormRegister<TestFormInputs>;
  error?: boolean;
  answerSelected?: number;
  answerStatus?: boolean;
}) => {
  return (
    <div key={`q-${question.code}`} className="mb-6 flex flex-col gap-y-4">
      <p className="text-xl font-bold">{question.question}</p>
      {question.answers.map((a) => {
        let classes = '';
        if (active) {
          classes =
            'hover:bg-primary-300 peer-checked:border-primary-500 peer-checked:bg-primary-300';
        } else {
          if (answerSelected === a.id) {
            classes = answerStatus
              ? 'peer-checked:border-green-500 peer-checked:bg-green-300'
              : 'peer-checked:border-red-500 peer-checked:bg-red-300';
          }
        }
        return (
          <div key={`q-${question.code}-a-${a.id}`}>
            <input
              type="radio"
              id={`q-${question.code}-a-${a.id}`}
              {...registerField(`${question.id}`)}
              value={a.id}
              className="peer mr-2 hidden"
              disabled={active}
              checked={answerSelected === a.id}
            />
            <label
              htmlFor={`q-${question.code}-a-${a.id}`}
              className={`inline-flex w-full rounded-xl p-2  ${classes}`}
            >
              <div className="block w-full">{a.answer}</div>
            </label>
          </div>
        );
      })}
      {error && (
        <p className="font-bold text-red-600">You must select an answer</p>
      )}
    </div>
  );
};

export default TestQuestion;
