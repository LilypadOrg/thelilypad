import Image from 'next/image';
import Link from 'next/link';
import { inferQueryOutput } from '~/utils/trpc';

type Contents = inferQueryOutput<'resources.all' | 'courses.all'>;

const RelatedContents = ({
  contents,
  title,
  type,
}: {
  contents: Contents;
  title: string;
  type: 'courses' | 'resources';
}) => {
  return (
    <div>
      <h6>{title}</h6>
      {contents.map((r) => (
        <div key={`related-${type}-${r.id}`} className="grid grid-cols-2 gap-4">
          {r.coverImageUrl && (
            <Image
              src={r.coverImageUrl}
              alt={`${r.title} thumbnail`}
              width="100px"
              height="85px"
              layout="intrinsic"
            />
          )}
          <Link href={`/${type}/${r.id}/${r.slug}`}>
            <a>{r.title}</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RelatedContents;
