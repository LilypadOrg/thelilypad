import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';
import { getFooterMainItems, getFooterSecItems } from '../utils/navLinks';

const Footer = () => {
  const footerMainItems = getFooterMainItems();
  const footerSecItems = getFooterSecItems();

  return (
    <div className="grid h-[24rem] w-full content-center justify-items-center bg-primary-500 bg-[url('/footerBanner.svg')] bg-contain text-white md:grid-cols-3">
      <div>
        <ul className="space-y-4">
          {footerMainItems.map((l) => (
            <li
              key={`footerlink-${l.path}`}
              className="flex items-center text-lg font-semibold"
            >
              <HiChevronRight className="text-2xl text-main-yellow" />

              <Link href={l.path}>
                <a className="text-main-yellow">{l.text}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul className="space-y-4">
          {footerSecItems.map((l) => (
            <li
              key={`footerlink-${l.path}`}
              className="flex items-center text-lg font-semibold"
            >
              <HiChevronRight className="text-2xl text-main-yellow" />

              <Link href={l.path}>
                <a className="text-main-yellow">{l.text}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;
