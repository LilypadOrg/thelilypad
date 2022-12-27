import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { Input, InputProps } from './Input';

export type FormInputProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  error?: FieldError | undefined;
} & Omit<InputProps, 'name'>;

export const FormInput = <TFormValues extends Record<string, unknown>>({
  className,
  name,
  register,
  rules,
  error,
  ...props
}: Omit<FormInputProps<TFormValues>, 'ref'>) => {
  return (
    <div className={className} aria-live="polite">
      <Input name={name} {...props} {...(register && register(name, rules))} />
      {error && <span>{error.message}</span>}
    </div>
  );
};
