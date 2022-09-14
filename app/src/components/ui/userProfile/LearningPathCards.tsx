import Image from 'next/image';
import Link from 'next/link';

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
    <div className="flex flex-col items-center space-y-4 bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex h-6 w-8 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
          &#10003;
        </div>
        <p className="text-md font-semibold leading-5">{title}</p>
      </div>
      <div className="my-4 h-24">
        <Image src={img} alt="froggy" height={'100%'} width={'100%'} />
      </div>
      <Link href={link} className="">
        {linkTitle}
      </Link>
    </div>
  );
};
