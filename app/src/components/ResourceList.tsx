import { inferQueryOutput } from '~/utils/trpc';
import ResourceListItem from './ResourceListItem';

type Resources = inferQueryOutput<'resources.all'>;

const ResourceList = ({ resources }: { resources: Resources }) => {
  return (
    <div className="flex flex-col gap-8">
      {resources.map((resource) => (
        <ResourceListItem key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;
