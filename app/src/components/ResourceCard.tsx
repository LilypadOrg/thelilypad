import Link from 'next/link';
import React from 'react';
import { limitStrLength } from '~/utils/formatters';
import resources from '../../prisma/seedData/resources.json';
import TagsPill from './TagsPill';

const ResourceCard = ({ resource }: { resource: typeof resources[0] }) => {
  return (
    <div className="flex flex-col rounded-md bg-main-gray-light px-4 py-4 shadow-md">
      <div className="mb-1 text-2xl font-bold">{resource.title}</div>
      <div className="flex">
        {resource.tags.map((name) => (
          <TagsPill key={`resource-${name}`} name={name} />
        ))}
      </div>
      <div className="mt-3 text-ellipsis text-base text-gray-700">
        {limitStrLength(resource.description, 80)}
      </div>
      <div className="self-end">
        <Link href={resource.url}>more details...</Link>
      </div>
    </div>
  );
};

export default ResourceCard;
