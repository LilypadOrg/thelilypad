import type { NextPage } from 'next';

const coursesList = [
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
  'Something',
];

const Home: NextPage = () => {
  return (
    <div>
      {/* Hero and cards */}
      <div className="px-[5.5rem]">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 flex flex-col space-y-4 ">
            {/* Hero Image */}
            <div className="relative min-h-[353px]  rounded-lg bg-gray-400 text-white">
              <div className=" absolute bottom-4 right-4 max-w-[25%] space-y-2 rounded-lg bg-primary-400 p-4">
                <h1 className="mb-0 text-lg">The Lily Pad</h1>
                <p className=" break-all text-sm font-light leading-[1.1]">
                  A community endeavouring to guide those self-learning in web3{' '}
                </p>
                <p className="text-sm font-light">#goForYou</p>
              </div>
            </div>
            {/* we help you grow */}
            <div className="flex flex-col rounded-lg bg-gray-300 p-6">
              {/* Heading and sub */}
              <div>
                <h1 className="mb-0 text-2xl">
                  We help you grow, learn & excell
                </h1>
                <span className="text-sm font-light">
                  Discover what we are all about
                </span>
              </div>
              {/* List */}
              <div className="mt-4 grid  w-[85%] grid-cols-2 gap-8 ">
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">RandoLorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
                <div className="flex space-x-3">
                  <p className="font-normal">&#62;</p>
                  <p className="underline">Lorem ipsum dolor sit amet</p>
                </div>
              </div>
            </div>
          </div>
          {/* Side List */}
          <div className="h-full rounded-lg  bg-gray-300 py-5 px-6">
            {/* header */}
            <div className="mt-6">
              <h1 className="mb-0 text-2xl">Courses</h1>
              <p className="text-sm">
                Become a real dev not just a fake one, we have evrything you
                need to be the best you can be
              </p>
            </div>
            {/* List */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="col-span-2 flex justify-between rounded-md bg-white py-2 px-4">
                <p className="">All Courses</p>
                <p className="font-normal">&#62;</p>
              </div>

              {coursesList.map((courseName, i) => (
                <div
                  className="flex justify-between rounded-md bg-white py-2 px-4"
                  key={`${i}-${courseName}`}
                >
                  <p className="">{courseName}</p>
                  <p className="font-normal">&#62;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-[10rem] w-[10rem] border-2  border-red-400"></div>
      </div>
    </div>
  );
};

export default Home;
