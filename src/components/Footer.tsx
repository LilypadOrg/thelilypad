import Link from 'next/link';
import { getFooterMainItems, getFooterSecItems } from '../utils/navLinks';

const Footer = () => {
  const footerMainItems = getFooterMainItems();
  const footerSecItems = getFooterSecItems();

  return (
    <div>
      <div className="mx-auto grid max-w-6xl md:grid-cols-3">
        <div>Social</div>
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
        </div>
      </div>
    </div>
  );
};

export default Footer;
