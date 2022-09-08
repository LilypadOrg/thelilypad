import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import CourseActionButtons from '~/components/CourseActionButtons';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import RelatedContents from '~/components/RelatedContents';

const Course: NextPage = () => {
  const courseId = Number(useRouter().query.id);
  const { data: course } = trpc.useQuery(['courses.byId', { id: courseId }], {
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const { data: resources } = trpc.useQuery(
    [
      'resources.related',
      {
        tags: course?.tags.map((t) => t.slug) || [],
        technologies: course?.technologies.map((t) => t.slug) || [],
      },
    ],
    { enabled: !!course }
  );

  const { data: session } = useSession();

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        {course && (
          <>
            <h3>{course.title}</h3>
            <div>
              <>
                <p>{course.title}</p>
                <p>{course.description}</p>
              </>
            </div>
          </>
        )}
        {session?.user && (
          <CourseActionButtons user={session.user} courseId={courseId} />
        )}
      </div>
      {/* <div>{resources && <RelatedResources resources={resources} />}</div> */}
      <div>
        {resources && (
          <RelatedContents
            contents={resources}
            title="Related Resources"
            type="resources"
          />
        )}
      </div>
    </div>
  );
};

export default Course;
