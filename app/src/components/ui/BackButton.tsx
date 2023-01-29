import classNames from 'classnames';
import Link from 'next/link';

export type ButtonProps = {
  text: string;
  url?: string;
  circle: boolean;
  outlined: boolean;
  color?: string;
  size?: 'lg' | 'nm' | 'sm' | 'xs';
} & React.ComponentProps<'button'>;

const BackButton = ({
  text,
  url,
  circle,
  outlined,
  color,
  size,
  onClick,
}: ButtonProps) => {
  const buttonClass = () => {
    return `btn btn-${size ?? 'nm'}${circle ? ' btn-circle' : ' btn-square'}${
      outlined ? ' btn-outline' : ''
    } btn-${color ?? 'primary'}`;
  };

  if (onClick)
    return (
      <div>
        <Link href={url ?? ''}>
          <button onClick={onClick} className={buttonClass()}>
            {text}
          </button>
        </Link>
      </div>
    );
  else
    return (
      <div>
        <Link href={url ?? ''}>
          <button className={buttonClass()}>{text}</button>
        </Link>
      </div>
    );
};

export default BackButton;
