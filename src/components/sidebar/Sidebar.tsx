import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FiShare2, FiUsers } from 'react-icons/fi';

import NextImage from '@/components/NextImage';
import SidebarLink from '@/components/sidebar/SidebarLink';
import SidebarLinkGroupItem from '@/components/sidebar/SidebarLinkGroupItem';

import useAuthStore from '@/store/useAuthStore';

import SidebarLinkGroup from './SidebarLinkGroup';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const activeRole = useAuthStore.useRole();
  const pathname = usePathname();

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== 'Escape') return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`z-9999 w-72.5 dark:bg-boxdark absolute left-0 top-0 flex h-screen flex-col overflow-y-hidden bg-black duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className='py-5.5 lg:py-6.5 flex items-center justify-between gap-2 px-6'>
        <div></div>
        <Link href='/'>
          <NextImage
            width={88}
            height={16}
            src='/favicon/android-chrome-192x192.png'
            alt='Logo'
          />
        </Link>

        <div>
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls='sidebar'
            aria-expanded={sidebarOpen}
            className='block lg:hidden'
          >
            <svg
              className='fill-current'
              width='20'
              height='18'
              viewBox='0 0 20 18'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z'
                fill=''
              />
            </svg>
          </button>
        </div>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        {/* <!-- Sidebar Menu --> */}
        <nav className='mt-5 px-4 py-4 lg:mt-9 lg:px-6'>
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className='text-bodydark2 mb-4 ml-4 text-sm font-semibold'>
              MENU
            </h3>

            <ul className='mb-6 flex flex-col gap-1.5'>
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <SidebarLink
                  href='/dashboard'
                  isActive={pathname.includes('dashboard')}
                >
                  <svg
                    className='fill-current'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z'
                      fill=''
                    />
                    <path
                      d='M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z'
                      fill=''
                    />
                    <path
                      d='M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z'
                      fill=''
                    />
                    <path
                      d='M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z'
                      fill=''
                    />
                  </svg>
                  Dashboard
                </SidebarLink>
              </li>
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Calendar --> */}
              {activeRole?.name == 'admin' && (
                <li>
                  <Link
                    href='/calendar'
                    className={`text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4 group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out ${
                      pathname.includes('calendar') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <svg
                      className='fill-current'
                      width='18'
                      height='18'
                      viewBox='0 0 18 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M15.7499 2.9812H14.2874V2.36245C14.2874 2.02495 14.0062 1.71558 13.6405 1.71558C13.2749 1.71558 12.9937 1.99683 12.9937 2.36245V2.9812H4.97803V2.36245C4.97803 2.02495 4.69678 1.71558 4.33115 1.71558C3.96553 1.71558 3.68428 1.99683 3.68428 2.36245V2.9812H2.2499C1.29365 2.9812 0.478027 3.7687 0.478027 4.75308V14.5406C0.478027 15.4968 1.26553 16.3125 2.2499 16.3125H15.7499C16.7062 16.3125 17.5218 15.525 17.5218 14.5406V4.72495C17.5218 3.7687 16.7062 2.9812 15.7499 2.9812ZM1.77178 8.21245H4.1624V10.9968H1.77178V8.21245ZM5.42803 8.21245H8.38115V10.9968H5.42803V8.21245ZM8.38115 12.2625V15.0187H5.42803V12.2625H8.38115ZM9.64678 12.2625H12.5999V15.0187H9.64678V12.2625ZM9.64678 10.9968V8.21245H12.5999V10.9968H9.64678ZM13.8374 8.21245H16.228V10.9968H13.8374V8.21245ZM2.2499 4.24683H3.7124V4.83745C3.7124 5.17495 3.99365 5.48433 4.35928 5.48433C4.7249 5.48433 5.00615 5.20308 5.00615 4.83745V4.24683H13.0499V4.83745C13.0499 5.17495 13.3312 5.48433 13.6968 5.48433C14.0624 5.48433 14.3437 5.20308 14.3437 4.83745V4.24683H15.7499C16.0312 4.24683 16.2562 4.47183 16.2562 4.75308V6.94683H1.77178V4.75308C1.77178 4.47183 1.96865 4.24683 2.2499 4.24683ZM1.77178 14.5125V12.2343H4.1624V14.9906H2.2499C1.96865 15.0187 1.77178 14.7937 1.77178 14.5125ZM15.7499 15.0187H13.8374V12.2625H16.228V14.5406C16.2562 14.7937 16.0312 15.0187 15.7499 15.0187Z'
                        fill=''
                      />
                    </svg>
                    Calendar
                  </Link>
                </li>
              )}
              {/* <!-- Menu Item Calendar --> */}
              {/* <!-- Menu Item Social --> */}
              <li>
                <Link
                  href='/social'
                  className={`text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4 group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out ${
                    pathname.includes('social') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FiShare2 />
                  Social
                </Link>
              </li>
              {/* <!-- Menu Item Social --> */}
              {/* <!-- Menu Item Manage User --> */}
              {activeRole?.name == 'admin' && (
                <li>
                  <Link
                    href='/manage-user'
                    className={`text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4 group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out ${
                      pathname.includes('manage-user') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <FiUsers />
                    Manage User
                  </Link>
                </li>
              )}
              {/* <!-- Menu Item Manage User --> */}
              {/* <!-- Menu Item Chat --> */}
              <li>
                <Link
                  href='/chat'
                  className={`text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4 group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out ${
                    pathname.includes('chat') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className='fill-current duration-300 ease-in-out'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M10.9688 1.57495H7.03135C3.43135 1.57495 0.506348 4.41558 0.506348 7.90308C0.506348 11.3906 2.75635 13.8375 8.26885 16.3125C8.40947 16.3687 8.52197 16.3968 8.6626 16.3968C8.85947 16.3968 9.02822 16.3406 9.19697 16.2281C9.47822 16.0593 9.64697 15.75 9.64697 15.4125V14.2031H10.9688C14.5688 14.2031 17.522 11.3625 17.522 7.87495C17.522 4.38745 14.5688 1.57495 10.9688 1.57495ZM10.9688 12.9937H9.3376C8.80322 12.9937 8.35322 13.4437 8.35322 13.9781V15.0187C3.6001 12.825 1.74385 10.8 1.74385 7.9312C1.74385 5.14683 4.10635 2.8687 7.03135 2.8687H10.9688C13.8657 2.8687 16.2563 5.14683 16.2563 7.9312C16.2563 10.7156 13.8657 12.9937 10.9688 12.9937Z'
                      fill=''
                    />
                    <path
                      d='M5.42812 7.28442C5.0625 7.28442 4.78125 7.56567 4.78125 7.9313C4.78125 8.29692 5.0625 8.57817 5.42812 8.57817C5.79375 8.57817 6.075 8.29692 6.075 7.9313C6.075 7.56567 5.79375 7.28442 5.42812 7.28442Z'
                      fill=''
                    />
                    <path
                      d='M9.00015 7.28442C8.63452 7.28442 8.35327 7.56567 8.35327 7.9313C8.35327 8.29692 8.63452 8.57817 9.00015 8.57817C9.33765 8.57817 9.64702 8.29692 9.64702 7.9313C9.64702 7.56567 9.33765 7.28442 9.00015 7.28442Z'
                      fill=''
                    />
                    <path
                      d='M12.5719 7.28442C12.2063 7.28442 11.925 7.56567 11.925 7.9313C11.925 8.29692 12.2063 8.57817 12.5719 8.57817C12.9375 8.57817 13.2188 8.29692 13.2188 7.9313C13.2188 7.56567 12.9094 7.28442 12.5719 7.28442Z'
                      fill=''
                    />
                  </svg>
                  Chat
                </Link>
              </li>
              {/* <!-- Menu Item Chat --> */}
              {/* <!-- Menu Item Profile --> */}
              <li>
                <Link
                  href='/profile'
                  className={`text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4 group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out ${
                    pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className='fill-current'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z'
                      fill=''
                    />
                    <path
                      d='M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z'
                      fill=''
                    />
                  </svg>
                  Profile
                </Link>
              </li>
              {/* <!-- Menu Item Profile --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className='text-bodydark2 mb-4 ml-4 text-sm font-semibold'>
              OTHERS
            </h3>

            <ul className='mb-6 flex flex-col gap-1.5'>
              {/* <!-- Menu Item Ui Elements --> */}
              <SidebarLinkGroup
                activeCondition={pathname === '/ui' || pathname.includes('ui')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <SidebarLink
                        href='#'
                        isActive={pathname === '/ui' || pathname.includes('ui')}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className='fill-current'
                          width='18'
                          height='19'
                          viewBox='0 0 18 19'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <g clipPath='url(#clip0_130_9807)'>
                            <path
                              d='M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V7.53335C0.506348 8.4896 1.29385 9.2771 2.2501 9.2771H15.7501C16.7063 9.2771 17.4938 8.4896 17.4938 7.53335V2.3021C17.4938 1.34585 16.7063 0.55835 15.7501 0.55835ZM16.2563 7.53335C16.2563 7.8146 16.0313 8.0396 15.7501 8.0396H2.2501C1.96885 8.0396 1.74385 7.8146 1.74385 7.53335V2.3021C1.74385 2.02085 1.96885 1.79585 2.2501 1.79585H15.7501C16.0313 1.79585 16.2563 2.02085 16.2563 2.3021V7.53335Z'
                              fill=''
                            />
                            <path
                              d='M6.13135 10.9646H2.2501C1.29385 10.9646 0.506348 11.7521 0.506348 12.7083V15.8021C0.506348 16.7583 1.29385 17.5458 2.2501 17.5458H6.13135C7.0876 17.5458 7.8751 16.7583 7.8751 15.8021V12.7083C7.90322 11.7521 7.11572 10.9646 6.13135 10.9646ZM6.6376 15.8021C6.6376 16.0833 6.4126 16.3083 6.13135 16.3083H2.2501C1.96885 16.3083 1.74385 16.0833 1.74385 15.8021V12.7083C1.74385 12.4271 1.96885 12.2021 2.2501 12.2021H6.13135C6.4126 12.2021 6.6376 12.4271 6.6376 12.7083V15.8021Z'
                              fill=''
                            />
                            <path
                              d='M15.75 10.9646H11.8688C10.9125 10.9646 10.125 11.7521 10.125 12.7083V15.8021C10.125 16.7583 10.9125 17.5458 11.8688 17.5458H15.75C16.7063 17.5458 17.4938 16.7583 17.4938 15.8021V12.7083C17.4938 11.7521 16.7063 10.9646 15.75 10.9646ZM16.2562 15.8021C16.2562 16.0833 16.0312 16.3083 15.75 16.3083H11.8688C11.5875 16.3083 11.3625 16.0833 11.3625 15.8021V12.7083C11.3625 12.4271 11.5875 12.2021 11.8688 12.2021H15.75C16.0312 12.2021 16.2562 12.4271 16.2562 12.7083V15.8021Z'
                              fill=''
                            />
                          </g>
                          <defs>
                            <clipPath id='clip0_130_9807'>
                              <rect
                                width='18'
                                height='18'
                                fill='white'
                                transform='translate(0 0.052124)'
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        UI Elements
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z'
                            fill=''
                          />
                        </svg>
                      </SidebarLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className='mb-5.5 mt-4 flex flex-col gap-2.5 pl-6'>
                          <li>
                            <SidebarLinkGroupItem
                              href='/sandbox/components#alert'
                              isActive={pathname === '/ui/alerts'}
                            >
                              Alerts
                            </SidebarLinkGroupItem>
                          </li>
                          <li>
                            <SidebarLinkGroupItem
                              href='/sandbox/components#button'
                              isActive={pathname === '/ui/alerts'}
                            >
                              Buttons
                            </SidebarLinkGroupItem>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Ui Elements --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
