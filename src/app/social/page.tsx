'use client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import ReactTimeAgo from 'react-time-ago';

import { searchUser, userKey } from '@/lib/api/user';
import axios from '@/lib/axios';
import { buildInfiniteTableURL, buildPaginatedTableURL } from '@/lib/table';
import useQueryToast from '@/hooks/toast/useQueryToast';
import useServerTable from '@/hooks/useServerTable';

import ButtonLink from '@/components/links/ButtonLink';
import NextImage from '@/components/NextImage';
import ServerCard from '@/components/table/ServerCard';
import ServerInfiniteCard from '@/components/table/ServerInfiniteCard';
import Typography from '@/components/typography/Typography';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';

import {
  ApiError,
  ApiResponse,
  BasePaginationResponseField,
  PaginatedApiResponse,
} from '@/types/api';
import { User } from '@/types/user';

export default function SocialPage() {
  const user = useAuthStore.useUser();
  const chatStore = useChatStore();

  const { tableState, setTableState } = useServerTable<
    Omit<User, 'email' | 'roles'>
  >({ pageSize: 6 });

  const url = buildPaginatedTableURL({
    baseUrl: '/user/search',
    tableState,
  });

  const { data, isPending } = useQueryToast(
    useQuery<
      PaginatedApiResponse<Array<Omit<User, 'email' | 'roles'>>>,
      AxiosError<ApiError>
    >({
      queryKey: [userKey, url],
      queryFn: searchUser,
      staleTime: Infinity, // for keeping fetched page data
    }),
    {},
    { hideSuccess: true }
  );

  const result = useInfiniteQuery({
    queryKey: [userKey, 'users', tableState.globalFilter],
    queryFn: async ({ pageParam }) => {
      return await axios
        .get<
          ApiResponse<
            {
              users: Array<Omit<User, 'email' | 'roles'>>;
            } & BasePaginationResponseField
          >
        >(
          buildInfiniteTableURL({
            baseUrl: '/user/search',
            page: pageParam as number,
            tableState,
          })
        )
        .then((res) => {
          const { users, ...rest } = res.data.data;
          return { ...rest, statusCode: 200, data: users };
        });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const maxPage = Math.ceil(
        lastPage.total / tableState.pagination.pageSize
      );
      return lastPageParam + 1 < maxPage ? lastPage.page : null;
    },
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
  });

  return (
    <>
      <div className='w-full'>
        <h2 className='text-lg md:text-xl'>Paginated Card</h2>
        <ServerCard
          card={
            <>
              <div className='mt-5 grid grid-cols-1 gap-5 md:grid-cols-3'>
                {data?.data.map((item) => (
                  <div
                    key={item.id}
                    className='flex h-32 p-5 shadow-lg dark:text-white dark:shadow-gray-700'
                  >
                    <div className='w-[80px] rounded-full'>
                      <NextImage
                        width={80}
                        height={80}
                        src={item.picture ?? '/images/profile_picture.jpg'}
                        classNames={{
                          image: 'rounded-full w-[80px] h-[80px] object-cover',
                        }}
                        alt='User'
                        className='w-[80px]'
                        unoptimized={true}
                      />
                    </div>
                    <div className='ml-5'>
                      <Typography variant='s2' className='dark:text-white'>
                        {item.username}
                      </Typography>
                      <Typography variant='s4' className='dark:text-white'>
                        Joined{' '}
                        <ReactTimeAgo
                          date={new Date(item.createdAt)}
                          locale='en-US'
                        />
                      </Typography>
                      {item.id !== user?.id && (
                        <div className='mt-1'>
                          <ButtonLink
                            href='/chat'
                            variant='outline'
                            className='border-graydark text-graydark hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-600'
                            onClick={() => {
                              const chat = chatStore.chatList?.find(
                                (chat) =>
                                  chat.user1.id == item.id ||
                                  chat.user2.id == item.id
                              );
                              if (chat) {
                                chatStore.setActiveChat(chat);
                              } else {
                                const newChat = {
                                  id: `${(user as User).id}-${item.id}`,
                                  user1: user as User,
                                  user2: item,
                                  lastMessage: '',
                                  lastMessageAt: null,
                                  isNewChat: true,
                                };
                                chatStore.setNewChat(newChat);
                                chatStore.setActiveChat(newChat);
                              }
                            }}
                          >
                            <svg
                              className='mr-1 fill-current duration-300 ease-in-out'
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
                          </ButtonLink>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          }
          response={data}
          data={data?.data ?? []}
          isLoading={isPending}
          tableState={tableState}
          setTableState={setTableState}
          className='mt-8'
          withFilter
        />
      </div>
      <div className='w-full'>
        <h2 className='text-lg md:text-xl'>Infinite Scroll</h2>
        <ServerInfiniteCard
          card={
            <>
              <div className='mt-5'>
                {result.data?.pages
                  .flatMap((page) => page.data)
                  .map((item) => (
                    <div
                      key={item.id}
                      className='flex h-32 p-5 shadow-lg dark:text-white dark:shadow-gray-700'
                    >
                      <div className='w-[80px] rounded-full'>
                        <NextImage
                          width={80}
                          height={80}
                          src={item.picture ?? '/images/profile_picture.jpg'}
                          classNames={{
                            image:
                              'rounded-full w-[80px] h-[80px] object-cover',
                          }}
                          alt='User'
                          className='w-[80px]'
                          unoptimized={true}
                        />
                      </div>
                      <div className='ml-5'>
                        <Typography variant='s2' className='dark:text-white'>
                          {item.username}
                        </Typography>
                        <Typography variant='s4' className='dark:text-white'>
                          Joined{' '}
                          <ReactTimeAgo
                            date={new Date(item.createdAt)}
                            locale='en-US'
                          />
                        </Typography>
                        {item.id !== user?.id && (
                          <div className='mt-1'>
                            <ButtonLink
                              href='/chat'
                              variant='outline'
                              className='border-graydark text-graydark hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-600'
                              onClick={() => {
                                const chat = chatStore.chatList?.find(
                                  (chat) =>
                                    chat.user1.id == item.id ||
                                    chat.user2.id == item.id
                                );
                                if (chat) {
                                  chatStore.setActiveChat(chat);
                                } else {
                                  const newChat = {
                                    id: `${(user as User).id}-${item.id}`,
                                    user1: user as User,
                                    user2: item,
                                    lastMessage: '',
                                    lastMessageAt: null,
                                    isNewChat: true,
                                  };
                                  chatStore.setNewChat(newChat);
                                  chatStore.setActiveChat(newChat);
                                }
                              }}
                            >
                              <svg
                                className='mr-1 fill-current duration-300 ease-in-out'
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
                            </ButtonLink>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          response={result.data?.pages.flatMap((page) => page.data)}
          data={result.data?.pages.flatMap((page) => page.data) ?? []}
          isLoading={isPending}
          tableState={tableState}
          setTableState={setTableState}
          className='mt-8'
          withFilter
          infiniteResult={result}
        />
      </div>
    </>
  );
}
