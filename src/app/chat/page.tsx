'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { FaChevronLeft } from 'react-icons/fa';

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
  const activeChat = useChatStore.useActiveChat();
  const setActiveChat = useChatStore.useSetActiveChat();
  const newChatMessageFromSocket = useChatStore.useNewChatMessageFromSocket();

  const fetchMessagesByChatId = useGetMessagesByChatId(
    !activeChat?.isNewChat && activeChat?.id ? activeChat.id : undefined
  );
  const messages = fetchMessagesByChatId.data?.data;

  const messageRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    const tempRef = messageRef.current;
    if (tempRef) {
      tempRef.scrollTop = tempRef.scrollHeight;
    }
  }, []);
  const getMessages = () => {
    if (messages) {
      const temp = [...messages];
      newChatMessageFromSocket
        .filter((item) => item.chatId == activeChat?.id)
        .forEach((item) => {
          //   add if not exists
          const findMessage = temp.find((message) => message.id == item.id);
          if (!findMessage) {
            temp.push(item);
            scrollToBottom();
          }
        });
      return temp;
    }
    return [];
  };
  useEffect(() => {
    if (getMessages() && getMessages().length) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMessages]);

  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit, resetField } = methods;
  const { isPending: isPendingCreateMessage, mutate: mutateCreateMessage } =
    useMutationToast<ApiResponse<ChatMessage>, CreateMessageParams>(
      useCreateMessage(),
      {},
      { hideSuccess: true, hideLoading: true }
    );

  const findReceiver = (chat: Chat) => {
    return chat.user1.id == user?.id ? chat.user2 : chat.user1;
  };

  const findReceiverByActiveChat = () => {
    if (activeChat) {
      return activeChat.user1.id == user?.id
        ? activeChat.user2
        : activeChat.user1;
    }
    return null;
  };
  const handleSendMessage: SubmitHandler<FieldValues> = (data) => {
    if (activeChat) {
      mutateCreateMessage(
        {
          message: data.message,
          receiver: findReceiver(activeChat).id,
        },
        {
          onSuccess: () => {
            resetField('message');
          },
        }
      );
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
            <div className='overflow-style-none border-top-0 border-bottom-0 border-left-0 w-full overflow-x-scroll border !border-[#E9E9E9] md:h-full md:w-1/3 md:overflow-x-hidden md:overflow-y-scroll'>
              <div className='overflow-style-none h-full w-full overflow-y-scroll'>
                <ul
                  className={cn(
                    'flex flex-col',
                    activeChat?.id && 'hidden md:flex',
                    'm-0 p-0'
                  )}
                >
                  {chatList &&
                    chatList.length > 0 &&
                    chatList.map((chat) => (
                      <li
                        key={chat.id}
                        onClick={() => {
                          setActiveChat(chat);
                        }}
                        className={cn(
                          'flex w-full cursor-pointer items-center space-x-3 px-2.5 py-3',
                          chat.id === activeChat?.id
                            ? 'bg-graydark'
                            : 'hover:bg-gray-500 hover:text-white'
                        )}
                      >
                        <div className=''>
                          <div className='w-[50px] rounded-full'>
                            <NextImage
                              width={50}
                              height={50}
                              src={
                                (chat.user1.id !== user?.id
                                  ? chat.user1.picture
                                  : chat.user2.picture) ??
                                '/images/profile_picture.jpg'
                              }
                              classNames={{
                                image:
                                  'rounded-full w-[50px] h-[50px] object-cover',
                              }}
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
                                chat.id === activeChat?.id
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
                                  chat.id === activeChat?.id
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

            {/*  message box*/}
            <div className='overflow-style-none relative w-full overflow-x-scroll md:w-2/3'>
              {activeChat?.id && (
                <div className='bg-graydark flex w-full cursor-pointer items-center space-x-3 px-2.5 py-3 md:hidden'>
                  <IconButton
                    className='border-none bg-transparent hover:bg-transparent'
                    icon={FaChevronLeft}
                    onClick={() => {
                      setActiveChat(null);
                    }}
                  />
                  <div className='relative h-[50px] w-[50px]'>
                    <NextImage
                      width={2000}
                      height={2000}
                      src={
                        (activeChat.user1.id !== user?.id
                          ? activeChat.user1.picture
                          : activeChat.user2.picture) ??
                        '/images/profile_picture.jpg'
                      }
                      classNames={{
                        image: 'rounded-full w-[50px] h-[50px] object-cover',
                      }}
                      alt='User'
                      className='w-[50px]'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex flex-col space-y-1'>
                      <span className='line-clamp-1 text-base font-medium text-white'>
                        {findReceiverByActiveChat()?.username ?? 'Joko'}
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
                  activeChat?.id
                    ? 'h-[526px] w-full overflow-y-scroll px-2.5 pt-2.5 md:h-[556px]'
                    : 'h-full'
                )}
              >
                {activeChat?.id && getMessages() && getMessages().length > 0 ? (
                  getMessages().map((item) => (
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
                      !activeChat?.id && 'hidden md:flex'
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
                        !activeChat?.id ? 'hidden' : ''
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
                          disabled={!activeChat?.id || isPendingCreateMessage}
                        >
                          {isPendingCreateMessage ? (
                            <Loader />
                          ) : (
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
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
