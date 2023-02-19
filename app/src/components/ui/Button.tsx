import classNames from 'classnames';

export type ButtonProps = {
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  subVariant?: 'fill' | 'outline';
  children: React.ReactNode;
} & React.ComponentProps<'button'>;

const classes = {
  'primary-fill':
    'rounded-xl bg-primary-500 px-4 py-2 font-semibold text-white hover:bg-primary-400 active:bg-primary-300 disabled:bg-gray-500',
  'primary-outline':
    'rounded-xl border border-primary-500 bg-white hover:bg-gray-100 active:bg-gray-200 px-2 py-1  font-semibold text-primary-500',
  'secondary-fill':
    'rounded-xl bg-secondary-500 px-4 py-2 font-semibold text-white hover:bg-secondary-400 active:bg-secondary-300 disabled:bg-gray-500',
  'secondary-outline':
    'rounded-xl border border-secondary-500 bg-white hover:bg-gray-100 active:bg-gray-200 bg-white px-2 py-1  font-semibold text-secondary-500',
  'danger-fill':
    'rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400 active:bg-red-300 disabled:bg-gray-500',
  'danger-outline':
    'rounded-xl border border-red-500 bg-white bg-white hover:bg-gray-100 active:bg-gray-200 px-2 py-1  font-semibold text-red-500',
};

const Button = ({
  children,
  className,
  onClick,
  variant = 'primary',
  subVariant = 'fill',
  ...props
}: ButtonProps) => {
  const defaultClasses = classes[`${variant}-${subVariant}`];

  return (
    <div>
      <button
        onClick={onClick}
        className={classNames(defaultClasses, className)}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
