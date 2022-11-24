import { inferQueryOutput } from '~/utils/trpc';

type FilterOptions = inferQueryOutput<
  'tags.byContentTYpe' | 'levels.byContentTYpe' | 'technologies.byContentTYpe'
>;

const ContentFilter = ({
  filterName,
  filterKey,
  filterOptions,
  filterValues,
  updateFilter,
}: {
  filterName: string;
  filterKey: string;
  filterOptions: FilterOptions;
  filterValues: string[] | string | undefined;
  updateFilter: (value: string, add: boolean, key: string) => void;
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.currentTarget;
    updateFilter(value, checked, filterKey);
  };

  const isChecked = (value: string) => {
    if (!filterValues) return false;
    return Array.isArray(filterValues)
      ? filterValues.includes(value)
      : value === filterValues;
  };

  return (
    <div>
      <h6>{filterName}</h6>
      {filterOptions && (
        <ul>
          {filterOptions.map((t) => (
            <li key={t.id}>
              <input
                className="mr-2"
                onChange={handleCheckboxChange}
                type="checkbox"
                name="tag"
                value={t.slug}
                id={t.slug}
                checked={isChecked(t.slug)}
              />
              <label htmlFor={t.slug}>
                {t.name} ({t._count.contents})
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContentFilter;
