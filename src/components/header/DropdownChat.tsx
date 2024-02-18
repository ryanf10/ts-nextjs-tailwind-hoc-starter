import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ReactTimeAgo from 'react-time-ago';

import { useGetChatList } from '@/lib/api/chat';

import NextImage from '@/components/NextImage';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';

export default function DropdownChat() {
  const user = useAuthStore.useUser();
  const chatList = useChatStore.useChatList();
  const initChatList = useChatStore.useInitChatList();
  const setActiveChat = useChatStore.useSetActiveChat();

  const fetchChatList = useGetChatList();
  useEffect(() => {
    if (fetchChatList.isSuccess && !chatList) {
      initChatList(fetchChatList.data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchChatList.isSuccess]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
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

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!dropdownOpen || key !== 'Escape') return;
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
        className='h-8.5 w-8.5 border-stroke bg-gray-1 hover:text-primary dark:border-strokedark dark:bg-meta-4 relative flex items-center justify-center rounded-full border-[0.5px] dark:text-white'
        href='#'
      >
        <span
          className={`z-1 bg-meta-1 absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ${
            notifying === false ? 'hidden' : 'inline'
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
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`h-90 w-75 border-stroke shadow-default dark:border-strokedark dark:bg-boxdark absolute -right-16 mt-2.5 flex flex-col rounded-sm border bg-white sm:right-0 sm:w-80 ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <div className='px-4.5 py-3'>
          <h5 className='text-bodydark2 text-sm font-medium'>Messages</h5>
        </div>

        <ul className='flex h-auto flex-col overflow-y-auto'>
          {chatList
            ?.filter((item) => !item.isNewChat)
            .map((item) => (
              <li key={item.id}>
                <Link
                  className='gap-4.5 border-stroke px-4.5 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 flex border-t py-3'
                  href='/chat'
                  onClick={() => {
                    setActiveChat(item);
                  }}
                >
                  <div className='w-[50px] rounded-full'>
                    <NextImage
                      width={50}
                      height={50}
                      src='/images/profile_picture.jpg'
                      classNames={{ image: 'rounded-full' }}
                      alt='User'
                      className='w-[50px]'
                    />
                  </div>

                  <div className='w-full'>
                    <h6 className='text-sm font-medium text-black dark:text-white'>
                      {item.user1.id !== user?.id
                        ? item.user1.username
                        : item.user2.username}
                    </h6>
                    <p className='truncate break-all text-sm'>
                      {item.lastMessage.length > 25
                        ? `${item.lastMessage.slice(0, 25)}...`
                        : item.lastMessage}
                    </p>
                    {item.lastMessageAt && (
                      <p className='text-xs'>
                        <ReactTimeAgo
                          date={new Date(item.lastMessageAt)}
                          locale='en-US'
                        />
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
      {/* <!-- Dropdown End --> */}
    </li>
  );
}
