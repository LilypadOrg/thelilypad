import Link from 'next/link';
import LevelPill from '../LevelPill';

export const InfoTile = ({
  title,
  tag,
  linkTitle,
  link,
}: {
  title: string;
  tag: string;
  linkTitle: string;
  link: string;
}) => {
  return (
    <div className="flex items-center justify-between  rounded-md border-2 border-main-gray-light py-3 px-4">
      <div className="space-y-1">
        <p className="text-lg font-bold">{title}</p>
        <LevelPill level={tag} classes="bg-main-gray-light" />
      </div>
      <Link href={link}>
        <a className="text-blue self-end underline">{linkTitle}</a>
      </Link>
    </div>
  );
};
