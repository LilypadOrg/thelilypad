import { useFormContext } from 'react-hook-form';
import { capitalizeFirstLetter } from '~/utils/formatters';

const TextInput = ({
  name,
  label,
  placeholder,
}: // error,
{
  name: string;
  label?: string;
  placeholder?: string;
  // error: FieldError | undefined;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const labelStr = label || capitalizeFirstLetter(name);

  console.log(errors[name]?.message);

  return (
    <div className="flex flex-col gap-4">
      <label className="font-bold uppercase tracking-widest">{labelStr}</label>
      <input
        className="rounded-sm bg-secondary-300 p-2 placeholder:text-gray-500"
        placeholder={placeholder || labelStr}
        {...register(name)}
      />
      {/* {error && <span className="font-bold text-red-600">{error.message}</span>} */}
      {errors[name] && <div>{errors[name]?.message?.toString()}</div>}
    </div>
  );
};

export default TextInput;
