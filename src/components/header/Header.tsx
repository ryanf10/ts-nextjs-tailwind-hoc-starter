import Link from 'next/link';

import ToggleThemeButton from '@/components/buttons/ToggleThemeButton';
import DropdownMessage from '@/components/header/DropdownMessage';
import DropdownNotification from '@/components/header/DropdownNotification';
import DropdownUser from '@/components/header/DropdownUser';

import Logo from '~/svg/Vercel.svg';

type HeaderProps = {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
};

export default function Header(props: HeaderProps) {
  return (
    <header className='drop-shadow-1 dark:bg-boxdark sticky top-0 z-[999] flex w-full bg-white dark:drop-shadow-none'>
      <div className='shadow-2 flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11'>
        <div className='flex items-center gap-2 sm:gap-4 lg:hidden'>
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls='sidebar'
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className='border-stroke dark:border-strokedark dark:bg-boxdark z-[99999] block rounded-sm border bg-white p-1.5 shadow-sm lg:hidden'
          >
            <span className='h-5.5 w-5.5 relative block cursor-pointer'>
              <span className='du-block absolute right-0 h-full w-full'>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className='absolute right-0 h-full w-full rotate-45'>
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className='block flex-shrink-0 lg:hidden' href='/'>
            <Logo className='w-4' />
          </Link>
        </div>
        <div className='hidden sm:block'></div>
        <div className='2xsm:gap-7 flex items-center gap-3'>
          <ul className='2xsm:gap-4 flex items-center gap-2'>
            {/* <!-- Dark Mode Toggler --> */}
            <ToggleThemeButton />
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            <DropdownNotification />
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            <DropdownMessage />
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
}
