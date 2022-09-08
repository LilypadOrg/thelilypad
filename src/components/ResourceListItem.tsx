import Image from 'next/image';
import Link from 'next/link';
import { inferQueryOutput } from '~/utils/trpc';

type Resource = inferQueryOutput<'resources.byId'>;

const ResourceListItem = ({ resource }: { resource: Resource }) => {
  return (
    <div key={`resource-${resource.id}`} className="flex flex-row gap-4">
      <div className=" w-[20%]">
        <Image
          src={resource.coverImageUrl || ''}
          alt={`${resource.title} thumbnail`}
          width="200px"
          height="140px"
          layout="intrinsic"
        />
      </div>
      <div className=" w-[80%]">
        <h4>
          <Link href={`/resources/${resource.id}/${resource.slug}`}>
            <a>{resource.title}</a>
          </Link>
        </h4>
        <p>{resource.description}</p>
      </div>
    </div>
  );
};

export default ResourceListItem;
