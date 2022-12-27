import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form';
import { Input, InputProps } from './Input';

export type FormInputProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  // register?: UseFormRegister<TFormValues>;
  error?: FieldError | undefined;
} & Omit<InputProps, 'name'> &
  Pick<UseFormReturn<TFormValues>, 'register' | 'formState'>;

export const FormInput = <TFormValues extends Record<string, unknown>>({
  className,
  name,
  register,
  formState,
  rules,
  error,
  ...props
}: Omit<FormInputProps<TFormValues>, 'ref'>) => {
  return (
    <div className={className} aria-live="polite">
      <Input {...props} {...(register && register(name, rules))} />
      {formState.errors.error && <span>{formState.errors.error.message}</span>}
    </div>
  );
};
