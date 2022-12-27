import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { capitalizeFirstLetter } from '~/utils/formatters';

export type InputSize = 'medium' | 'large';
export type InputType = 'text' | 'email';

export type InputProps = {
  id?: string;
  name: string;
  label?: string;
  className?: string;
} & React.ComponentProps<'input'>;

// Using maps so that the full Tailwind classes can be seen for purging
// see https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { id, name, label, type = 'text', className = '', placeholder, ...props },
    ref
  ) => {
    const labelStr = label || capitalizeFirstLetter(name);
    const placeholderStr = placeholder || labelStr;

    return (
      <input
        id={id}
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
    );
  }
);

Input.displayName = 'Input';
