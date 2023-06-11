const About = () => {
  return (
    // TODO: replace Lorem ipsum with actual content
    <div className="flex h-screen flex-col items-center justify-center gap-32 pb-32">
      <div>
        <div className="z-10 flex flex-col text-center">
          <div>
            <h1 className="text-3xl font-thin uppercase tracking-wider">
              About Us
            </h1>
          </div>
          <div className="mx-20">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
            ducimus, sed eum dicta veniam sint odit! Voluptas fuga perferendis,
            consequuntur reiciendis magnam soluta enim quasi eius quam at sequi
            nulla vel aspernatur tempore itaque debitis mollitia alias, veniam
            ut dignissimos recusandae expedita. Assumenda similique magni maxime
            quae unde eveniet perferendis illo soluta reprehenderit numquam
            fugit, esse veritatis optio praesentium omnis iusto, veniam ullam,
            expedita ducimus sunt a iste eaque enim? Fugit atque omnis
            doloremque aspernatur nam, at quasi enim sint, eligendi dolore
            dignissimos eaque earum pariatur? Omnis doloremque tempora,
            quibusdam eveniet at illum, asperiores, a aliquid quisquam ut ea
            repudiandae.
          </div>
        </div>
      </div>

      <div className="flex w-screen flex-col">
        <div className="relative flex w-screen justify-center py-10">
          <div className="absolute top-40 left-[40rem] h-[30rem] w-[30rem] animate-blob rounded-full bg-secondary-400 opacity-75 mix-blend-multiply blur-xl filter"></div>
          <div className="animation-delay-1000 absolute top-20 right-[35rem] h-[30rem] w-[30rem] animate-blob rounded-full bg-primary-400 opacity-75 mix-blend-multiply blur-xl filter"></div>
          <div className="animation-delay-2000 absolute -top-28 h-[30rem] w-[30rem] animate-blob rounded-full bg-secondary-300 opacity-75 mix-blend-multiply blur-xl filter"></div>
        </div>

        <div className="relative mx-5 flex w-screen flex-row justify-center gap-20">
          <div className="cardContainer">
            <div className="card">
              <div className="cardFront">Mission</div>
              <div className="cardBack font flex flex-col justify-around text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                <button className="rounded-sm bg-white p-4 text-black">
                  More Information
                </button>
              </div>
            </div>
          </div>
          <div className="cardContainer">
            <div className="card">
              <div className="cardFront">Path</div>
              <div className="cardBack">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </div>
            </div>
          </div>
          <div className="cardContainer">
            <div className="card">
              <div className="cardFront">Team</div>
              <div className="cardBack">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
