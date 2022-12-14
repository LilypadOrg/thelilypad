import React, { useEffect, useState } from 'react';

const LightThemeSvg = ({
  theme,
}: {
  theme: 'dark' | 'light' | 'system' | undefined;
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 h-8 w-8"
    >
      <path
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        className={`${
          theme == 'light' ? 'stroke-sky-500' : 'stroke-slate-400'
        }  dark:stroke-slate-500`}
      ></path>
      <path
        d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
        className={`${
          theme == 'light'
            ? 'stroke-sky-500'
            : 'stroke-slate-400 dark:stroke-slate-500'
        }`}
      ></path>
    </svg>
  );
};

const DarkThemeSvg = ({
  theme,
}: {
  theme: 'dark' | 'light' | 'system' | undefined;
}) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="mr-2 h-7 w-7">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
        className="fill-transparent"
      ></path>
      <path
        d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
        className={`${
          theme == 'dark'
            ? 'fill-sky-500'
            : 'fill-slate-400 dark:fill-slate-500'
        }`}
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
        className={`${
          theme == 'dark'
            ? 'fill-sky-500'
            : 'fill-slate-400 dark:fill-slate-500'
        }`}
      ></path>
    </svg>
  );
};

const SystemThemeSvg = ({
  theme,
}: {
  theme: 'dark' | 'light' | 'system' | undefined;
}) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="mr-2 h-8 w-8">
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
        strokeWidth="2"
        strokeLinejoin="round"
        className={`${
          theme == 'system'
            ? 'stroke-sky-500'
            : 'stroke-slate-400 dark:stroke-slate-500'
        } fill-sky-400/20`}
      ></path>
      <path
        d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${
          theme == 'system'
            ? 'stroke-sky-500'
            : 'stroke-slate-400 dark:stroke-slate-500'
        } `}
      ></path>
    </svg>
  );
};

const DarkModeSwitch = () => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system' | undefined>();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.theme === 'dark') {
      setTheme('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('system');
    }

    // TODO: remove listener after menu is closed
    // TODO: find if this can be done without a window listenernp
    window.addEventListener('click', (event) => {
      const menu = document.getElementById('themeMenu');

      if (!menu) return;
      const parentDiv = (event.target as Element).closest('div#themeMenuIcon');
      if (!parentDiv) {
        setShowMenu(false);
      }
    });
  }, []);

  useEffect(() => {
    if (theme === undefined) return;

    const mode =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light';

    localStorage.theme = theme;

    switch (mode) {
      case 'dark': {
        document.documentElement.classList.add('dark');
        break;
      }
      case 'light': {
        document.documentElement.classList.remove('dark');
        break;
      }
    }
  }, [theme]);

  return (
    <>
      <div className="relative hidden md:block">
        <div id="themeMenuIcon" onClick={() => setShowMenu(true)}>
          <button className="dark:hidden">
            <LightThemeSvg theme={theme} />
          </button>
          <button className="hidden dark:flex">
            <DarkThemeSvg theme={theme} />
          </button>
        </div>
        {theme !== undefined && (
          <ul
            id="themeMenu"
            className={`dark:highlight-white/5 absolute top-0 right-0 z-50 mt-8 w-36 overflow-hidden rounded-lg bg-white py-1 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-slate-900/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-0 ${
              showMenu ? '' : 'hidden'
            }`}
            aria-labelledby="headlessui-listbox-label-3"
            aria-orientation="vertical"
            role="listbox"
            // tabIndex="0"
          >
            <button className="w-full" onClick={() => setTheme('light')}>
              <li
                className={`flex cursor-pointer items-center py-1 px-2 ${
                  theme == 'light' ? 'text-sky-500' : ''
                }`}
                aria-selected="false"
                role="option"
                // tabIndex="-1"
              >
                <LightThemeSvg theme={theme} />
                Light
              </li>
            </button>
            <button className="w-full" onClick={() => setTheme('dark')}>
              <li
                className={`flex cursor-pointer items-center py-1 px-2 ${
                  theme == 'dark' ? 'text-sky-500' : ''
                }`}
                role="option"
                aria-selected="false"
                // tabIndex="-1"
              >
                <DarkThemeSvg theme={theme} />
                Dark
              </li>
            </button>
            <button className="w-full" onClick={() => setTheme('system')}>
              <li
                className={`flex cursor-pointer items-center py-1 px-2 ${
                  theme == 'system' ? 'text-sky-500' : ''
                }`}
                role="option"
                aria-selected="false"
                // tabIndex="-1"
              >
                <SystemThemeSvg theme={theme} />
                System
              </li>
            </button>
          </ul>
        )}
      </div>
    </>
  );
};

export default DarkModeSwitch;
