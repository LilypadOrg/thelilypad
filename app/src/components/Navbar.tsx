import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import ConnectWallet from './ConnectWallet';
import { getNavBarItems } from '../utils/navLinks';
import AccountWidget from './AccountWidget';

const Navbar = () => {
  const [visibile, setVisibile] = useState<boolean>(false);
  const [shadow, setShadow] = useState<boolean>(false);
  const navBarItems = getNavBarItems();

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };

    window.addEventListener('scroll', handleShadow);
  }, []);

  const showNavBar = () => {
    setVisibile(true);
  };

  const hideNavBar = () => {
    setVisibile(false);
  };

  return (
    <div className="h-20">
      <div
        className={`fixed z-[100] h-20 w-full bg-white dark:bg-slate-900 ${
          shadow ? ' shadow-md shadow-black' : ''
        } `}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-start px-2">
          {/* Only visible for screen below medium size (i.e.: mobile) */}
          <div onClick={showNavBar} className="md:hidden">
            <AiOutlineMenu size={25} />
          </div>

          <div className="shrink-0 grow text-center md:grow-0">
            <Link href="/">
              <a className="hover:border-0">
                <Image src="/logo.png" alt="logo" width="50" height="50" />
              </a>
            </Link>
          </div>
          {/* hidden for screen size below medium (i.e.: mobile) 
            //TODO: move border styling out of individual lis
            */}
          <ul className="hidden md:flex md:flex-grow">
            {navBarItems.map((link) => (
              <li
                key={`navlink-${link.path}`}
                className="ml-10 text-sm uppercase"
              >
                <Link href={link.path}>
                  <a>{link.text}</a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-evenly gap-4">
            <ConnectWallet />
            <AccountWidget />
          </div>
        </div>

        {/* for small screens
        overlay shadowing the whole page when the menu is open  */}
        <div
          className={
            visibile ? 'fixed left-0 top-0 h-screen w-full bg-black/70' : ''
          }
        >
          <div
            className={`fixed top-0 h-screen w-[75%] bg-slate-900 p-10 duration-300 ease-in  sm:w-[60%] md:w-[45%]
            ${visibile ? 'left-0 ' : 'left-[-100%]'}`}
          >
            <div>
              <div className="flex w-full items-center justify-between">
                <Link href="/">
                  <a>
                    <Image
                      src="/assets/navLogo.png"
                      alt="logo"
                      width="64"
                      height="45"
                    />
                  </a>
                </Link>
                <div
                  onClick={hideNavBar}
                  className="cursor-pointer rounded-full p-3"
                >
                  <AiOutlineClose />
                </div>
              </div>
            </div>
            <div className="flex flex-col py-4">
              <ul className="uppercase">
                {navBarItems.map((link) => (
                  <li
                    key={link.text}
                    onClick={hideNavBar}
                    className="py-4 text-sm"
                  >
                    <Link href={link.path}>
                      <a>{link.text}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
