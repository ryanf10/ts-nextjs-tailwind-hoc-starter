import { QueryFunction, useQuery } from '@tanstack/react-query';

import axios from '@/lib/axios';

import { ApiResponse } from '@/types/api';
import { AuthUser } from '@/types/user';

export const getProfileKey = 'get-profile-key';
export const useGetProfile = (token?: string) => {
  return useQuery({
    queryKey: [getProfileKey, token],
    queryFn: getProfile,
    enabled: !!token,
    retry: 3,
  });
};
export const getProfile: QueryFunction<ApiResponse<AuthUser>> = async ({
  queryKey,
}) => {
  const [_, token] = queryKey;
  const response = await axios.get<ApiResponse<AuthUser>>(`/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
