import LevelPill from './ui/LevelPill';

interface option {
  value: number;
  label: string;
}

const PillSelector = ({
  label = 'Values',
  options,
  value,
  onChange,
}: {
  label: string;
  options: option[];
  value: number[];
  onChange: (value: number[]) => void;
}) => {
  const selected = options.filter((s) => value.includes(s.value));
  const available = options.filter((s) => !value.includes(s.value));

  const addSelected = (addedValue: number) => {
    const values = [...value, addedValue];
    onChange(values);
  };

  const removeSelected = (removedValue: number) => {
    const values = value.filter((s) => s !== removedValue);
    onChange(values);
  };

  return (
    <div>
      <label className="font-bold uppercase tracking-widest">
        Selected {label}
      </label>

      <div className="flex flex-wrap">
        {selected.map((ts) => (
          <button
            key={`selected-${ts.value}`}
            onClick={() => removeSelected(ts.value)}
          >
            <LevelPill
              level={ts.label}
              noColor={true}
              classes="justify-self-start bg-white"
            />
          </button>
        ))}
      </div>
      <div className="font-bold uppercase tracking-widest">Select {label}</div>
      <div>
        {available?.map((ts) => (
          <button
            key={`available-${ts.value}`}
            onClick={() => addSelected(ts.value)}
          >
            <LevelPill level={ts.label} classes="justify-self-start" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PillSelector;
