import Image from 'next/image';
import Link from 'next/link';
import { RefObject } from 'react';

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
    <div className="grid min-h-[95vh] grid-cols-3">
      <div className="col-span-2 hidden h-full items-center justify-center bg-[url('/homeBanner.png')] bg-cover md:flex">
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
      <div className="col-span-3 flex h-full flex-col items-center justify-evenly  bg-[url('/homeBanner.png')] px-4 md:col-span-1">
        <div className="order-first flex  items-center justify-start rounded-lg  lg:col-span-5">
          <Image
            src="/images/sbt-frontpage.gif"
            alt="sbt"
            layout="intrinsic"
            width="475px"
            height="375px"
            className="block rounded-lg"
          />
        </div>
        <p className="text-center text-3xl text-gray-300">
          <span className="font-bold">Track your self-learning progress</span>{' '}
          and show it to the world through the{' '}
          <span className="font-bold">soulbound token. </span>
          <Link href="/courses">
            <span className=" link ml-2 text-2xl text-secondary-400">
              Learn More...
            </span>
          </Link>
        </p>
        <button className="btn-primary mb-10  rounded-xl text-lg font-semibold leading-4 tracking-wide text-white md:hidden">
          Minting now!
        </button>
        {/* Right */}
      </div>
    </div>
  );
};

export default HomeHero;
