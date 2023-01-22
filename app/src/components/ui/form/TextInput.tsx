import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { capitalizeFirstLetter } from '~/utils/formatters';
import { FieldError } from 'react-hook-form';

export type InputType = 'text' | 'email';

// export type InputProps = {
//   id?: string;
//   name: string;
//   label?: string;
//   type?: InputType;
//   className?: string;
//   error: FieldError | undefined;
// } & Omit<
//   DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
//   'size'
// >;

type InputProps = {
  name: string;
  label?: string;
  className?: string;
  error: FieldError | undefined;
} & React.ComponentProps<'input'>;

const TextInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      // id,
      name,
      label,
      type = 'text',
      className = '',
      placeholder,
      error,
      ...props
    },
    ref
  ) => {
    const labelStr = label || capitalizeFirstLetter(name);
    const placeholderStr = placeholder || labelStr;

    return (
      <>
        <label htmlFor={name}>{labelStr}</label>
        <input
          name={name}
          type={type}
          ref={ref}
          aria-label={labelStr}
          placeholder={placeholderStr}
          className={classNames([
            'relative inline-flex w-full rounded border border-gray-300 bg-gray-50 p-4 leading-none text-gray-700 placeholder-gray-500 transition-colors ease-in-out hover:border-blue-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-30',
            className,
          ])}
          {...props}
        />
        {error && <span className="text-red-600">{error.message}</span>}
      </>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
