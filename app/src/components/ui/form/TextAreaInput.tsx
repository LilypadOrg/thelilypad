import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

const TextAreaInput = ({
  label,
  placeholder,
  error,
  register,
}: {
  label: string;
  placeholder?: string;
  error: FieldError | undefined;
  register: UseFormRegisterReturn;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="font-bold uppercase tracking-widest">{label}</label>
      <textarea
        className="rounded-lg bg-secondary-300 p-2 placeholder:text-gray-500"
        placeholder={placeholder || label}
        {...register}
      />
      {error && <span>{error.message}</span>}
    </div>
  );
};

export default TextAreaInput;
