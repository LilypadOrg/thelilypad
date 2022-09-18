const TagsPill = ({ name, classes }: { name: string; classes?: string }) => {
  return (
    <span
      className={`mr-2 inline-block rounded-full bg-main-gray-dark px-2 text-xs font-semibold text-black ${classes}`}
    >
      {name}
    </span>
  );
};

export default TagsPill;
