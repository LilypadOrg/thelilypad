import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';

const TagFilter = ({
  filterValues,
  updateFilter,
}: {
  filterValues: string[] | string | undefined;
  updateFilter: (value: string, add: boolean, key: string) => void;
}) => {
  const { data: tags } = trpc.useQuery(['tags.all'], {
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.currentTarget;
    updateFilter(value, checked, 'tags');
  };

  const isChecked = (value: string) => {
    if (!filterValues) return false;
    return Array.isArray(filterValues)
      ? filterValues.includes(value)
      : value === filterValues;
  };

  return (
    <div>
      <h6>Tags</h6>
      {tags && (
        <ul>
          {tags.map((t) => (
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
              <label htmlFor={t.slug}>{t.name}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagFilter;
