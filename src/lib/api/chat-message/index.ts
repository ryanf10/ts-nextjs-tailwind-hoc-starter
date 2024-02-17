import { QueryFunction, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import axios from '@/lib/axios';

import { ApiError, ApiResponse } from '@/types/api';
import { ChatMessage } from '@/types/chat-message';

export const chatMessageKey = 'chat-message-key';
export const useGetMessagesByChatId = (chatId: string | undefined) => {
  return useQuery({
    queryKey: [chatMessageKey, chatId],
    queryFn: getMessagesByChatId,
    retry: 3,
    enabled: !!chatId,
  });
};
export const getMessagesByChatId: QueryFunction<
  ApiResponse<Array<ChatMessage>>
> = async ({ queryKey }) => {
  const [_, chatId] = queryKey;
  const response = await axios.get<ApiResponse<Array<ChatMessage>>>(
    `/chat-message/chat/${chatId}`
  );
  return response.data;
};

export type CreateMessageParams = {
  message: string;
  receiver: string;
};
export const useCreateMessage = () => {
  return useMutation<
    ApiResponse<ChatMessage>,
    AxiosError<ApiError>,
    CreateMessageParams
  >({
    mutationFn: async ({ message, receiver }: CreateMessageParams) => {
      const res = await axios.post<ApiResponse<ChatMessage>>('/chat-message', {
        message,
        receiver,
      });
      return res.data;
    },
  });
};
