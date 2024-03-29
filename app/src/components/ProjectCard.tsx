import Image from 'next/image';
import Link from 'next/link';
import { Project } from '~/types/types';
import { PROJECTS_IMAGE_PATH } from '~/utils/constants';
import { limitStrLength } from '~/utils/formatters';

export const SpotLightCards = ({
  project,
  teal,
}: {
  project: Project;
  teal: boolean;
}) => {
  const id = project.id;
  const { slug, title, coverImageUrl, description } = project.content;

  return (
    <div className="cursor-pointer">
      <Link href={`/projects/${id}/${slug}`}>
        <div
          key={`featured-${title}`}
          className="primary-shadow relative flex items-center justify-center border-[0.1rem] border-primary-700 bg-dark-blue shadow-[10px_10px_1px_#7B61FF] transition-all hover:shadow-[-1px_-1px_1px_#7B61FF]"
        >
          {coverImageUrl && (
            <Image
              src={`${PROJECTS_IMAGE_PATH}${coverImageUrl}`}
              alt={`${title} thumbnail`}
              height={320}
              width={420}
            />
          )}
          <div
            className={` absolute bottom-4 right-4 max-w-[45%] space-y-2 rounded-sm p-4 text-white  ${
              !teal ? 'bg-primary-500' : 'bg-secondary-400'
            }`}
          >
            <h1 className="mb-0 break-words text-[0.75rem] lg:text-[0.9rem]">
              {limitStrLength(title, 25)}
            </h1>
            <p className="text-[0.65rem] font-light leading-[1.1] lg:text-sm">
              {limitStrLength(description, 50)}
            </p>
            {/* <p className="text-sm font-light">#goForYou</p> */}
          </div>
        </div>
      </Link>
    </div>
  );
};
