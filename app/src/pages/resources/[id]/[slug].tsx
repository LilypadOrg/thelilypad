import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';
import RelatedContents from '~/components/RelatedContents';

const Resource: NextPage = () => {
  const resourceId = Number(useRouter().query.id);
  const { data: resource } = trpc.useQuery(
    ['resources.byId', { id: resourceId }],
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );
  const { data: courses } = trpc.useQuery(
    [
      'courses.related',
      {
        tags: resource?.tags.map((t) => t.slug) || [],
        technologies: resource?.technologies.map((t) => t.slug) || [],
      },
    ],
    { enabled: !!resource }
  );

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        {resource && (
          <>
            <h3>{resource.title}</h3>
            <div>
              <>
                <p>{resource.title}</p>
                <p>{resource.description}</p>
              </>
            </div>
          </>
        )}
      </div>
      <div>
        {courses && (
          <RelatedContents
            contents={courses}
            title="Related Courses"
            type="courses"
          />
        )}
      </div>
    </div>
  );
};

export default Resource;
