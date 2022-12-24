import { MutableRefObject, useState } from 'react';
import LevelPill from './ui/LevelPill';

interface option {
  value: number;
  label: string;
}

const PillSelector = ({
  label = 'Values',
  options,
  selectedOptions: selectedOptions,
}: {
  label: string;
  options: option[];
  selectedOptions: MutableRefObject<number[]>;
}) => {
  const [selectedValues, setSelectedValues] = useState<Array<number>>([]);

  const selected = options.filter((s) => selectedValues.includes(s.value));
  const available = options.filter((s) => !selectedValues.includes(s.value));

  const addSelected = (value: number) => {
    const values = [...selectedValues, value];
    setSelectedValues(values);
    selectedOptions.current = values;
  };

  const removeSelected = (value: number) => {
    const values = selectedValues.filter((s) => s !== value);

    setSelectedValues(values);
    selectedOptions.current = values;
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
