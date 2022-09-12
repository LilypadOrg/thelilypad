import type { NextPage } from 'next';
import { toast } from 'react-toastify';
import ContentFilter from '~/components/ContentFilter';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import CourseList from '~/components/CourseList';
import { ContentType } from '~/types/types';

const Courses: NextPage = () => {
  const [contentFilters, setContentFilters] = useState<ContentFilterType>({});
  const { data: content } = trpc.useQuery(['courses.all', contentFilters], {
    onError: (err) => {
      toast.error(err.message);
    },
    // onSuccess: (data) => {
    //   console.log('Success. Data:');
    //   console.log(data);
    // },
  });

  const { data: techs } = trpc.useQuery(
    ['technologies.byContentTYpe', { contentType: ContentType.COURSE }],
    {
      // TODO: Find a way to manage error globally
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => console.log(data),
    }
  );

  const { data: tags } = trpc.useQuery(
    ['tags.byContentTYpe', { contentType: ContentType.COURSE }],
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  const { data: levels } = trpc.useQuery(['courseLevels.forCourses'], {
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
    const { tags, technologies, levels } = router.query;
    setContentFilters({ tags, technologies, levels });
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
      <h3>Courses</h3>
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
            {levels && (
              <ContentFilter
                filterName="Level"
                filterKey="levels"
                filterOptions={levels}
                filterValues={contentFilters.levels}
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
          {content && <CourseList courses={content} />}
        </div>
      </div>
    </div>
  );
};

export default Courses;
