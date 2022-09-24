const TagsPill = ({ name, classes }: { name: string; classes?: string }) => {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-white p-2 text-xs font-semibold text-black ${classes}`}
    >
      {name}
    </span>
  );
};

export default TagsPill;
