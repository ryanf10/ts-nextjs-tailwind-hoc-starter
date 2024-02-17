'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { FaChevronLeft } from 'react-icons/fa';

import { useGetChatList } from '@/lib/api/chat';
import {
  CreateMessageParams,
  useCreateMessage,
  useGetMessagesByChatId,
} from '@/lib/api/chat-message';
import { cn } from '@/lib/utils';
import useMutationToast from '@/hooks/toast/useMutationToast';

import IconButton from '@/components/buttons/IconButton';
import { LeftBubble, RightBubble } from '@/components/chat/Bubble';
import Input from '@/components/forms/Input';
import Loader from '@/components/loader/Loader';
import NextImage from '@/components/NextImage';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';

import { ApiResponse } from '@/types/api';
import { Chat } from '@/types/chat';
import { ChatMessage } from '@/types/chat-message';

export default function ChatPage() {
  const user = useAuthStore.useUser();
  const chatList = useChatStore.useChatList();
  const initChatList = useChatStore.useInitChatList();
  const activeChatId = useChatStore.useActiveChatId();
  const setActiveChatId = useChatStore.useSetActiveChatId();

  const fetchChatList = useGetChatList();
  useEffect(() => {
    if (fetchChatList.isSuccess) {
      initChatList(fetchChatList.data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchChatList.isSuccess]);

  const fetchMessagesByChatId = useGetMessagesByChatId(
    activeChatId ?? undefined
  );
  const messages = fetchMessagesByChatId.data?.data;

  const messageRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    const tempRef = messageRef.current;
    if (tempRef) {
      tempRef.scrollTop = tempRef.scrollHeight;
    }
  }, []);
  useEffect(() => {
    if (messages && messages.length) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;
  const { mutate } = useMutationToast<
    ApiResponse<ChatMessage>,
    CreateMessageParams
  >(useCreateMessage());

  const findInterlocutor = (chat: Chat) => {
    return chat.user1.id == user?.id ? chat.user2.id : chat.user1.id;
  };
  const handleSendMessage: SubmitHandler<FieldValues> = (data) => {
    const chat = chatList?.find((chat) => chat.id == activeChatId);
    if (chat) {
      mutate({
        message: data.message,
        receiver: findInterlocutor(chat),
      });
    }
  };

  return (
    <>
      <div className='w-full'>
        <div
          className='h-[600px] w-full bg-white transition duration-700 ease-in-out'
          style={{ boxShadow: '0px 4px 109px rgba(0, 0, 0, 0.12)' }}
        >
          <div className='h-full w-full md:flex'>
            {fetchChatList.isLoading ? (
              <Loader />
            ) : (
              <>
                <div className='overflow-style-none border-top-0 border-bottom-0 border-left-0 w-full overflow-x-scroll border !border-[#E9E9E9] md:h-full md:w-1/3 md:overflow-x-hidden md:overflow-y-scroll'>
                  <div className='overflow-style-none h-full w-full overflow-y-scroll'>
                    <ul
                      className={cn(
                        'flex flex-col',
                        activeChatId && 'hidden md:flex',
                        'm-0 p-0'
                      )}
                    >
                      {chatList &&
                        chatList.length > 0 &&
                        chatList.map((chat) => (
                          <li
                            key={chat.id}
                            onClick={() => {
                              setActiveChatId(chat.id);
                            }}
                            className={cn(
                              'flex w-full cursor-pointer items-center space-x-3 px-2.5 py-3',
                              chat.id === activeChatId
                                ? 'bg-graydark'
                                : 'hover:bg-gray-500 hover:text-white'
                            )}
                          >
                            <div className=''>
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
                            </div>
                            <div className='flex-1'>
                              <div className='flex flex-col space-y-1'>
                                <span
                                  className={cn(
                                    'text-base font-medium',
                                    chat.id === activeChatId
                                      ? 'text-white'
                                      : 'text-black',
                                    'line-clamp-1'
                                  )}
                                >
                                  {chat.user1.id !== user?.id
                                    ? chat.user1.username
                                    : chat.user2.username}
                                </span>
                                <div className='block w-48'>
                                  <span
                                    className={cn(
                                      'text-xs',
                                      chat.id === activeChatId
                                        ? 'text-white'
                                        : 'text-black',
                                      'line-clamp-1'
                                    )}
                                  >
                                    {chat.lastMessage.length > 25
                                      ? `${chat.lastMessage.slice(0, 25)}...`
                                      : chat.lastMessage}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* TODO: lanjutkan */}
                <div className='overflow-style-none relative w-full overflow-x-scroll md:w-2/3'>
                  {activeChatId && messages && (
                    <div className='bg-graydark flex w-full cursor-pointer items-center space-x-3 px-2.5 py-3 md:hidden'>
                      <IconButton
                        className='border-none bg-transparent hover:bg-transparent'
                        icon={FaChevronLeft}
                        onClick={() => {
                          setActiveChatId(null);
                        }}
                      />
                      <div className='relative h-[50px] w-[50px]'>
                        <NextImage
                          width={50}
                          height={50}
                          src='/images/profile_picture.jpg'
                          classNames={{ image: 'rounded-full' }}
                          alt='User'
                          className='w-[50px]'
                        />
                      </div>
                      <div className='flex-1'>
                        <div className='flex flex-col space-y-1'>
                          <span className='line-clamp-1 text-base font-medium text-white'>
                            {messages[0].sender.username}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/*message body*/}
                  <div
                    ref={messageRef}
                    className={cn(
                      'overflow-style-none relative',
                      activeChatId
                        ? 'h-[526px] w-full overflow-y-scroll px-2.5 pt-2.5 md:h-[556px]'
                        : 'h-full'
                    )}
                  >
                    {activeChatId && messages && messages.length > 0 ? (
                      messages.map((item) => (
                        <>
                          {/* Sender */}
                          {item.sender.id == user?.id && (
                            <div key={item.id} className='mb-2 mr-10 w-full'>
                              <RightBubble
                                message={item.message}
                                createdAt={item.createdAt}
                              />
                            </div>
                          )}
                          {/* Receiver */}
                          {item.sender.id != user?.id && (
                            <div className='mb-2 mr-10'>
                              <LeftBubble
                                message={item.message}
                                createdAt={item.createdAt}
                              />
                            </div>
                          )}
                        </>
                      ))
                    ) : (
                      <div
                        className={cn(
                          'flex h-full w-full items-center justify-center',
                          !activeChatId && 'hidden md:flex'
                        )}
                      >
                        <div>
                          <div>
                            <h1 className='text-center text-[20px] font-bold text-[#1D1D1D]'>
                              No Message Yet
                            </h1>
                            <span className='text-center text-sm text-[#797979]'>
                              {' '}
                              No message in your inbox
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className='relative'>
                    <FormProvider {...methods}>
                      <form
                        onSubmit={handleSubmit(handleSendMessage)}
                        className='space-y-3'
                      >
                        <div
                          className={`flex h-[44px] w-full justify-between bg-[#E2E8EB] ${
                            !activeChatId ? 'hidden' : ''
                          }`}
                        >
                          <Input
                            label={null}
                            id='message'
                            type='text'
                            containerClassName='border-none bg-[#E2E8EB] text-[#85959E] focus:outline-none h-full w-full mb-0 '
                            className='h-[44px] rounded-none border-none bg-transparent'
                          />

                          <div className='flex items-center space-x-5'>
                            <button
                              // onClick={() => send()}
                              type='submit'
                              className='bg-graydark flex h-full w-[50px] items-center justify-center !border-none text-white'
                              // disabled={
                              //   !messageStore.selectedKKKSId ||
                              //   createMessageByVendor.isLoading
                              // }
                            >
                              {/*{createMessageByVendor.isLoading ? (*/}
                              {/*  <LoadingSpinnerOnButton />*/}
                              {/*) : (*/}
                              <span>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  viewBox='0 0 24 24'
                                  width='26'
                                  height='26'
                                  className='fill-white'
                                >
                                  <path fill='none' d='M0 0h24v24H0z' />
                                  <path d='M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z' />
                                </svg>
                              </span>
                              {/*)}*/}
                            </button>
                          </div>
                        </div>
                      </form>
                    </FormProvider>

                    {/*  message box*/}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
