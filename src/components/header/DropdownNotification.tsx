import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';

import { useGetNotifications } from '@/lib/api/notifications/get-notifications';

import useNotificationStore from '@/store/useNotificationStore';

TimeAgo.addDefaultLocale(en);

import { socket } from '@/lib/socket';

import { Notification } from '@/types/notification';

export default function DropdownNotification() {
  const notifications = useNotificationStore.useNotifications();
  const initNotifications = useNotificationStore.useInit();
  const addOneNotification = useNotificationStore.useAddOne();
  const fetchNotifications = useGetNotifications();
  useEffect(() => {
    if (fetchNotifications.isSuccess) {
      initNotifications(fetchNotifications.data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNotifications.isSuccess]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current || !trigger.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    function newNotificationEvent(data: Notification) {
      addOneNotification(data);
      if (!dropdownOpen) {
        setNotifying(true);
      }
    }

    socket.on('notification', newNotificationEvent);
    return () => {
      socket.off('notification', newNotificationEvent);
    };
  }, [dropdownOpen, addOneNotification]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <li className='relative'>
      <Link
        ref={trigger}
        onClick={() => {
          setNotifying(false);
          setDropdownOpen(!dropdownOpen);
        }}
        href='#'
        className='h-8.5 w-8.5 border-stroke bg-gray-1 hover:text-primary dark:border-strokedark dark:bg-meta-4 relative flex items-center justify-center rounded-full border-[0.5px] dark:text-white'
      >
        <span
          className={`z-1 bg-meta-1 absolute -top-0.5 right-0 h-2 w-2 rounded-full ${
            !notifying ? 'hidden' : 'inline'
          }`}
        >
          <span className='-z-1 bg-meta-1 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75'></span>
        </span>

        <svg
          className='fill-current duration-300 ease-in-out'
          width='18'
          height='18'
          viewBox='0 0 18 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z'
            fill=''
          />
        </svg>
      </Link>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`-right-27 h-90 w-75 border-stroke shadow-default dark:border-strokedark dark:bg-boxdark absolute mt-2.5 flex flex-col rounded-sm border bg-white sm:right-0 sm:w-80 ${
          dropdownOpen ? 'block' : 'hidden'
        }`}
      >
        <div className='px-4.5 py-3'>
          <h5 className='text-bodydark2 text-sm font-medium'>Notification</h5>
        </div>

        <ul className='flex h-auto flex-col overflow-y-auto'>
          {notifications?.map((notification) => {
            return (
              <li key={notification.id}>
                <Link
                  className='border-stroke px-4.5 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 flex flex-col gap-2.5 border-t py-3'
                  href='#'
                >
                  <p className='text-sm'>{notification.message}</p>
                  <p className='text-xs'>
                    <ReactTimeAgo
                      date={new Date(notification.createdAt)}
                      locale='en-US'
                    />
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
