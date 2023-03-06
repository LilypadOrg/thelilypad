import { BsCheck2 } from 'react-icons/bs';

export const CourseCardLoading = () => {
  return (
    <div className="flex min-h-[350px] min-w-[10rem] flex-col  justify-between self-start rounded-sm bg-white shadow-lg  lg:min-h-[400px] lg:min-w-[20rem]">
      <div className="flex flex-col justify-start">
        <div className="relative h-[182px] w-full animate-pulse rounded-tr-lg rounded-tl-lg bg-gray-400">
          <div className="absolute bottom-2 right-2 flex items-center">
            <div className="animate-pulse rounded-sm  bg-gray-500 py-[0.7rem] text-xs text-gray-200">
              <span className="text-transparent">randomTextSize</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-x-4 px-4 pt-4 pb-2">
          <div className="animate-pulse rounded-full bg-gray-400 py-[0.27rem] px-4  text-xs text-gray-200">
            <span className="text-transparent">Beginner</span>
          </div>
          <div className="animate-pulse rounded-full bg-gray-400 py-[0.27rem] px-4  text-xs text-gray-200">
            <span className="text-transparent">Beginner</span>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center delay-75">
            <div className="animate-pulse rounded-sm  bg-gray-400 px-2 py-[0.3rem] text-xs text-gray-200 delay-75">
              <span className="text-transparent">
                Lorem ipsum dolor sit amet consectetur.
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-[0.4rem]">
            <div className="rounded-sm  bg-gray-400 px-2 text-xs text-gray-200">
              <span className="text-transparent">
                Lorem ipsum dolor sit amet consectetur.
              </span>
            </div>
            <div className="animate-pulse rounded-sm  bg-gray-400 px-2 text-xs text-gray-200">
              <span className="text-transparent">
                Lorem ipsum dolor sit amet consectetur.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-2 mr-2 flex items-center justify-end gap-x-2">
        <div className=" animate-pulse rounded-full border-2 bg-gray-400 p-2  text-lg text-transparent">
          <BsCheck2 className="bg-transparent" />
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="m-h-64 transform cursor-pointer rounded-sm bg-white p-2 transition duration-300 hover:translate-y-2 hover:shadow-xl">
  <figure className="mb-2">
    <div className="ml-auto mr-auto h-64 w-64 animate-pulse rounded-sm bg-gray-400" />
  </figure>
  <div className="gradient-bg-card-card flex animate-pulse flex-col rounded-sm p-4">
    <div className="mt-2 flex items-center">
      <div className="animate-pulse rounded-sm  bg-gray-400 px-2 py-[0.1rem] text-xs text-gray-200">
        <span className="text-transparent">randomTextrandomText</span>
      </div>
    </div>

    <div className="mt-2 flex items-center">
      <div className="animate-pulse rounded-sm  bg-gray-400 px-2 py-[0.1rem] text-xs text-gray-200">
        <span className="text-transparent">randomText</span>
      </div>
    </div>
  </div>
</div>; */
}
