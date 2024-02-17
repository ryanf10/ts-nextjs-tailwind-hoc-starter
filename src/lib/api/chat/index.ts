import { QueryFunction, useQuery } from '@tanstack/react-query';

import axios from '@/lib/axios';

import useChatStore from '@/store/useChatStore';

import { ApiResponse } from '@/types/api';
import { Chat } from '@/types/chat';

export const chatKey = 'chat-key';
export const useGetChatList = () => {
  const chat = useChatStore().chatList;
  return useQuery({
    queryKey: [chatKey],
    queryFn: getChatList,
    retry: 3,
    enabled: !chat,
  });
};
export const getChatList: QueryFunction<
  ApiResponse<Array<Chat>>
> = async () => {
  const response = await axios.get<ApiResponse<Array<Chat>>>(`/chat/user`);
  return response.data;
};
