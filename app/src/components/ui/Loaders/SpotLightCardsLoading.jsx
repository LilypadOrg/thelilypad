export const SpotLightCardsLoading = () => {
  return (
    <div
      className="relative flex h-[320px] w-[420px] animate-pulse items-center justify-center rounded-lg  border-[0.1rem]
    bg-gray-300"
    >
      <div className="absolute bottom-4 right-4 max-w-[45%] animate-pulse space-y-2 rounded-lg bg-gray-400 p-4">
        <h1 className="mb-0 break-words text-[0.9rem] text-transparent">
          Hello random text
        </h1>
        <p className="text-sm font-light leading-[1.1]  text-transparent">
          random text
        </p>
        {/* <p className="text-sm font-light">#goForYou</p> */}
      </div>
    </div>
  );
};
