export const navItems = [
  {
    text: 'Home',
    path: '/',
    navBar: false,
    footerMain: true,
    footerSec: false,
  },
  {
    text: 'Courses',
    path: '/courses',
    navBar: true,
    footerMain: true,
    footerSec: false,
  },
  {
    text: 'Resources',
    path: '/resources',
    navBar: true,
    footerMain: true,
    footerSec: false,
  },
  {
    text: 'Spotlights',
    path: '/spotlights',
    navBar: true,
    footerMain: true,
    footerSec: false,
  },
  {
    text: 'About',
    path: '/about',
    navBar: false,
    footerMain: false,
    footerSec: true,
  },
  {
    text: 'Team',
    path: '/team',
    navBar: false,
    footerMain: false,
    footerSec: true,
  },
  {
    text: 'White Paper',
    path: '/whitepaper',
    navBar: false,
    footerMain: false,
    footerSec: true,
  },
];

export const getNavBarItems = () => {
  return navItems.filter((l) => l.navBar);
};

export const getFooterMainItems = () => {
  return navItems.filter((l) => l.footerMain);
};

export const getFooterSecItems = () => {
  return navItems.filter((l) => l.footerSec);
};
