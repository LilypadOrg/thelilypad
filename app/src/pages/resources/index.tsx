import type { NextPage } from 'next';
import { toast } from 'react-toastify';
import ContentFilter from '~/components/ContentFilter';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import ResourceList from '~/components/ResourceList';

const Resources: NextPage = () => {
  const [contentFilters, setContentFilters] = useState<ContentFilter>({});
  const { data: content } = trpc.useQuery(['resources.all', contentFilters], {
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: techs } = trpc.useQuery(['technologies.forResources'], {
    // TODO: Find a way to manage error globally
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: tags } = trpc.useQuery(['tags.forResources'], {
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // console.log('courses');
  // console.log(courses);
  // console.log('tech');
  // console.log(techs);

  const router = useRouter();

  useEffect(() => {
    const { tags, technologies } = router.query;
    setContentFilters({ tags, technologies });
  }, [router.query]);

  const updateFilter = (value: string, add: boolean, key: string) => {
    let currValue = router.query[key];
    if (currValue) {
      currValue = Array.isArray(currValue) ? currValue : [currValue];
    } else {
      currValue = [];
    }

    const newValue: string[] | undefined = add
      ? currValue.concat(value)
      : currValue.filter((i) => i !== value);

    const newState = { ...contentFilters, [key]: newValue };
    const newQuery = { ...router.query, [key]: newValue };

    if (!newValue.length) {
      delete newState[key];
      delete newQuery[key];
    }

    // setCourseFilters(newState);
    router.push({ query: newQuery });
  };

  return (
    <div>
      <h3>Resources</h3>
      <div className="grid grid-cols-5 gap-4">
        {/* Filters */}
        <div>
          <h5>Filters</h5>
          <div className="flex flex-col gap-6">
            {techs && (
              <ContentFilter
                filterName="Technology"
                filterKey="technologies"
                filterOptions={techs}
                filterValues={contentFilters.technologies}
                updateFilter={updateFilter}
              />
            )}
            {tags && (
              <ContentFilter
                filterName="Tags"
                filterKey="tags"
                filterOptions={tags}
                filterValues={contentFilters.tags}
                updateFilter={updateFilter}
              />
            )}
            {/* <TechFilter
              filterValues={courseFilters.technologies}
              updateFilter={updateFilter}
            />
            <LevelFilter
              filterValues={courseFilters.levels}
              updateFilter={updateFilter}
            />
            <TagFilter
              filterValues={courseFilters.tags}
              updateFilter={updateFilter}
            /> */}
          </div>
        </div>

        {/* Course List */}
        <div className="col-span-4">
          {content && <ResourceList resources={content} />}
        </div>
      </div>
    </div>
  );
};

export default Resources;
