import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import axios from '@/lib/axios';

import { ApiError, ApiResponse } from '@/types/api';
import { User } from '@/types/user';

export type RegisterParam = {
  email: string;
  username: string;
  password: string;
};
export const useRegister = () => {
  return useMutation<ApiResponse<User>, AxiosError<ApiError>, RegisterParam>({
    mutationFn: async ({ email, username, password }: RegisterParam) => {
      const res = await axios.post<ApiResponse<User>>('/auth/register', {
        username: username,
        email: email,
        password: password,
      });
      return res.data;
    },
  });
};
