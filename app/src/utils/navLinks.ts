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
    text: 'Legal',
    path: '/legal',
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
