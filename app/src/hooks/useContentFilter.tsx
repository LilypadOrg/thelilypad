import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ContentType } from '~/types/types';
import { trpc } from '~/utils/trpc';

export const useContentFilter = (contenType: ContentType) => {
  const [contentFilters, setContentFilters] = useState<ContentFilterType>({});

  const { data: levels, isLoading: levelsLoading } = trpc.useQuery([
    'levels.byContentTYpe',
  ]);

  const { data: tags, isLoading: tagsLoading } = trpc.useQuery([
    'tags.byContentTYpe',
    { contentType: contenType },
  ]);

  const { data: techs, isLoading: techsLoading } = trpc.useQuery([
    'technologies.byContentTYpe',
    { contentType: contenType },
  ]);

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

  const isLoading = levelsLoading || tagsLoading || techsLoading;

  return { techs, tags, levels, isLoading, contentFilters, updateFilter };
};
