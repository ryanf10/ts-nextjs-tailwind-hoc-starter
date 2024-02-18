import { QueryFunction } from '@tanstack/react-query';

import axios from '@/lib/axios';

import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';

export const userKey = 'user';
export const searchUser: QueryFunction<
  ApiResponse<Array<Omit<User, 'email' | 'roles'>>>
> = async ({ queryKey }) => {
  const [_, keyword] = queryKey;
  const response = await axios.get<
    ApiResponse<Array<Omit<User, 'email' | 'roles'>>>
  >(`/user/search?keyword=${keyword}`);
  return response.data;
};
