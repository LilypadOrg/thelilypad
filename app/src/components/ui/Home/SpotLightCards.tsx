import Image from 'next/image';
import { limitStrLength } from '~/utils/formatters';

interface Props {
  title: string;
  description: string;
  coverImageUrl: string | null;
  teal: boolean;
}

export const SpotLightCards = ({
  title,
  description,
  coverImageUrl,
  teal,
}: Props) => {
  return (
    <div
      key={`featured-${title}`}
      className="relative flex items-center justify-center rounded-lg border-[0.1rem] border-primary-600 bg-primary-600"
    >
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={`${title} thumbnail`}
          height={320}
          width={420}
          className="rounded-lg transition-all hover:scale-95"
        />
      )}
      <div
        className={` absolute bottom-4 right-4 max-w-[45%] space-y-2 rounded-lg p-4 text-white  ${
          !teal ? 'bg-primary-500' : 'bg-secondary-400'
        }`}
      >
        <h1 className="mb-0 break-words text-[0.9rem]">
          {limitStrLength(title, 25)}
        </h1>
        <p className="text-sm font-light leading-[1.1]">
          {limitStrLength(description, 50)}
        </p>
        {/* <p className="text-sm font-light">#goForYou</p> */}
      </div>
    </div>
  );
};
