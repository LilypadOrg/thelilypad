import { UseFormRegister } from 'react-hook-form';
import { Question, TestFormInputs } from '~/types/types';

const TestQuestion = ({
  sequenceNumber,
  question,
  disabled,
  registerField,
  error,
  answerSelected,
  answerStatus,
}: {
  sequenceNumber: number;
  question: Question;
  disabled: boolean;
  registerField: UseFormRegister<TestFormInputs>;
  error?: boolean;
  answerSelected?: number;
  answerStatus?: boolean;
}) => {
  return (
    <div key={`q-${question.code}`} className="flex flex-col gap-y-4">
      <div>
        <p className="uppercase text-gray-500">{question.technology.name}</p>
        <p className="text-xl font-bold uppercase">
          #{sequenceNumber}. {question.question}
        </p>
      </div>

      {question.answers.map((a) => {
        let classes = '';
        if (!disabled) {
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
              defaultChecked={answerSelected === a.id}
              disabled={disabled}
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
      {/* {error && (
        <p className="font-bold text-red-600">You must select an answer</p>
      )} */}
    </div>
  );
};

export default TestQuestion;
