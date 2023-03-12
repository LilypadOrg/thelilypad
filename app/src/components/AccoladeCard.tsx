import Image from 'next/image';
import React from 'react';
import { Accolade } from '~/types/types';

const AccoladeCard = ({ accolade }: { accolade: Accolade }) => {
  return (
    // TODO: remove fix heigth
    <div
      className="flex min-h-[350px]
       max-w-[20rem] flex-col justify-between self-start rounded-sm  bg-white
       text-center lg:min-w-[20rem]"
    >
      <div className="flex flex-col justify-start">
        <div className="relative h-[120px] w-full rounded-tr-lg rounded-tl-lg bg-main-gray-dark lg:h-[182px]">
          {accolade.imageUrl && (
            <Image
              src={accolade.imageUrl}
              alt="Course thumbnail"
              layout="fill"
              objectFit="contain"
            />
          )}
        </div>

        <div className=" px-4 py-4">
          <div className="mb-2 text-[.885rem]  font-bold lg:text-lg">
            {accolade.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccoladeCard;
