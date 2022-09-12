const LevelPill = ({ level }: { level: string }) => {
  let colorClasses;
  if (level === 'Beginner') {
    colorClasses = 'bg-green-200 text-green-600';
  } else if (level === 'Intermediate') {
    colorClasses = 'bg-yellow-200 text-yellow-600';
  } else if (level === 'Intermediate') {
    colorClasses = 'bg-red-200 text-red-600';
  } else {
    colorClasses = `bg-main-gray-dark text-black`;
  }

  return (
    <span
      className={`mr-2 mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${colorClasses}`}
    >
      {level}
    </span>
  );
};

export default LevelPill;
