import Image from 'next/image';
import { RefObject } from 'react';
import { HiChevronRight } from 'react-icons/hi';

const HomeHero = ({
  scrollToRef,
}: {
  scrollToRef: RefObject<HTMLDivElement>;
}) => {
  const scrollToContent = () => {
    setTimeout(() => {
      if (scrollToRef?.current) {
        scrollToRef.current.scrollIntoView(true);
      }
    }, 200);
  };

  return (
    <div className="grid h-[55vh] min-h-screen grid-cols-3">
      <div className="col-span-2 hidden h-full bg-[url('/homeBanner.png')] bg-cover md:block">
        <div className="px-8 pt-12">
          <p className="bg-gradient-to-br from-primary-400 to-secondary-300 bg-clip-text pb-8 text-center text-5xl font-extrabold leading-normal text-transparent sm:text-7xl lg:text-8xl">
            Join our Web3 Self
            <br />
            Learning Community
          </p>

          <div className="mt-8 flex w-full justify-center space-x-4">
            <button
              className="btn-primary rounded-xl text-lg font-semibold leading-4 tracking-wide text-white"
              onClick={scrollToContent}
            >
              Browse Content
            </button>
            <button className="btn-primary rounded-xl text-lg font-semibold leading-4 tracking-wide text-white">
              Minting now!
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-3 flex h-full flex-col  items-center justify-evenly gap-y-4  bg-[url('/homeBanner.png')] px-4 md:col-span-1">
        <div className="flex  flex-col justify-center text-3xl">
          <p className=" text-gray-300 md:text-black">
            <span className="font-bold">Track your self-learning progress</span>{' '}
            and show it to the world through the{' '}
            <span className="font-bold">soulbound token</span>
          </p>
          <div className="mt-3 flex items-center text-lg font-semibold">
            <HiChevronRight className=" text-secondary-400" />
            <p className="text-secondary-400">Learn More</p>
          </div>
        </div>
        {/* // TODO: Add mint button to this section for mobile */}
        {/* Right */}
        <div className="order-first flex  items-center justify-start rounded-lg  lg:order-last lg:col-span-5">
          <Image
            src="/images/sbt-frontpage.gif"
            alt="sbt"
            layout="intrinsic"
            width="475px"
            height="375px"
            className="block rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
