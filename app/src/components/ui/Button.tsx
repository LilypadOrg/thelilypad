import classNames from 'classnames';
import Link from 'next/link';

export type ButtonProps = {
  text: string;
  url?: string;
  className?: string;
} & React.ComponentProps<'button'>;

const Button = ({ text, url, className, onClick }: ButtonProps) => {
  const inner = url ? <Link href={url}>{text}</Link> : text;

  return (
    <div>
      <button
        onClick={onClick}
        className={classNames(
          'rounded-xl bg-primary-400 px-4 py-2 font-bold text-white hover:bg-primary-300 active:bg-primary-500 disabled:bg-gray-500',
          className
        )}
      >
        {inner}
      </button>
    </div>
  );
};

export default Button;
