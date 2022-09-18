import Image from 'next/image';
import Link from 'next/link';
import { TiTick } from 'react-icons/ti';

export const LearningPathCards = ({
  title,
  img,
  linkTitle,
  link,
}: {
  title: string;
  img: string;
  linkTitle: string;
  link: string;
}) => {
  return (
    <div className="flex flex-col items-center space-y-4 rounded-md bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex h-6 w-8 items-center justify-center rounded-full bg-green-600">
          <TiTick className="text-lg text-white" />
        </div>
        <p className="text-md font-semibold leading-5">{title}</p>
      </div>
      <div className="my-4 h-24">
        <Image src={img} alt="froggy" height={'100%'} width={'100%'} />
      </div>
      <Link href={link}>
        <a className="underline underline-offset-2 hover:no-underline">
          {linkTitle}
        </a>
      </Link>
    </div>
  );
};
