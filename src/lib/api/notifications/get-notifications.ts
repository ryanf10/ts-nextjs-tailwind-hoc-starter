import { QueryFunction, useQuery } from '@tanstack/react-query';

import axios from '@/lib/axios';

import { ApiResponse } from '@/types/api';
import { Notification } from '@/types/notification';

export const getNotificationsKey = 'get-notifications-key';
export const useGetNotifications = () => {
  return useQuery({
    queryKey: [getNotificationsKey],
    queryFn: getNotifications,
    retry: 3,
  });
};
export const getNotifications: QueryFunction<
  ApiResponse<Array<Notification>>
> = async () => {
  const response = await axios.get<ApiResponse<Array<Notification>>>(
    `/notifications/user`
  );
  return response.data;
};
