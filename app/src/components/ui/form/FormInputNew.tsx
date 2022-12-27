import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormReturn,
} from 'react-hook-form';
import { Input, InputProps } from './Input';

export type FormInputProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  // register?: UseFormRegister<TFormValues>;
} & Omit<InputProps, 'name'> &
  Pick<UseFormReturn<TFormValues>, 'register' | 'formState'>;

export const FormInput = <TFormValues extends Record<string, unknown>>({
  className,
  name,
  register,
  formState,
  rules,
  ...props
}: Omit<FormInputProps<TFormValues>, 'ref'>) => {
  return (
    <div className={className} aria-live="polite">
      <Input {...props} {...(register && register(name, rules))} />
      {formState.errors.error && (
        <span>{formState.errors.error.message?.toString()}</span>
      )}
    </div>
  );
};
