import { QueryFunction, useQuery } from '@tanstack/react-query';

import axios from '@/lib/axios';

import useNotificationStore from '@/store/useNotificationStore';

import { ApiResponse } from '@/types/api';
import { Notification } from '@/types/notification';

export const getNotificationsKey = 'get-notifications-key';
export const useGetNotifications = () => {
  const notifications = useNotificationStore.useNotifications();
  return useQuery({
    queryKey: [getNotificationsKey],
    queryFn: getNotifications,
    retry: 3,
    enabled: !notifications,
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
