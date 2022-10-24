import Link from 'next/link';

const LevelPill = ({
  level,
  classes,
  url,
  noColor,
}: {
  level: string;
  classes?: string;
  url?: string;
  noColor?: boolean;
}) => {
  let colorClasses: string;

  if (noColor) {
    colorClasses = '';
  } else if (level === 'Beginner') {
    colorClasses = 'bg-green-200 text-green-600';
  } else if (level === 'Intermediate') {
    colorClasses = 'bg-yellow-200 text-yellow-600';
  } else if (level === 'Advanced') {
    colorClasses = 'bg-red-200 text-red-600';
  } else {
    colorClasses = `bg-main-gray-dark text-black`;
  }

  const InnerPill = () => (
    <span
      className={`mr-2 mb-2 inline-block rounded-full px-3 py-1 text-xs  font-semibold lg:text-sm ${colorClasses} ${classes}`}
    >
      {level}
    </span>
  );

  return url ? (
    <Link href={url}>
      <button>
        <InnerPill />
      </button>
    </Link>
  ) : (
    <InnerPill />
  );
};

export default LevelPill;
