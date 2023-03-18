import Link from 'next/link';
import { Resources } from '~/types/types';

const RelatedResources = ({ resources }: { resources: Resources }) => {
  return (
    <div>
      <h6>Related Resources</h6>
      <ul>
        {resources.map((r) => (
          <li key={`resource-${r.id}`}>
            <Link href={`/resources/${r.id}/${r.slug}`}>
              <a>{r.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedResources;
