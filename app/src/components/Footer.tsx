// import Link from 'next/link';
// import { getFooterMainItems, getFooterSecItems } from '../utils/navLinks';

const Footer = () => {
  // const footerMainItems = getFooterMainItems();
  // const footerSecItems = getFooterSecItems();

  return (
    <div className="mt-8 grid  h-72 w-full bg-primary-500 text-white md:grid-cols-3">
      {/* <div>Social</div>
        <div>
          <ul>
            {footerMainItems.map((l) => (
              <li key={`footerlink-${l.path}`}>
                <Link href={l.path}>
                  <a>{l.text}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul>
            {footerSecItems.map((l) => (
              <li key={`footerlink-${l.path}`}>
                <Link href={l.path}>
                  <a>{l.text}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div> */}
    </div>
  );
};

export default Footer;
