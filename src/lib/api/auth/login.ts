import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import axios from '@/lib/axios';

import { ApiError, ApiResponse } from '@/types/api';

export type LoginParam = {
  email: string;
  password: string;
};
export const useLogin = () => {
  return useMutation<
    ApiResponse<{ access_token?: string; refresh_token?: string }>,
    AxiosError<ApiError>,
    LoginParam
  >({
    mutationFn: async ({ email, password }: LoginParam) => {
      const res = await axios.post<
        ApiResponse<{ access_token?: string; refresh_token?: string }>
      >('/auth/login', {
        email: email,
        password: password,
      });
      return res.data;
    },
  });
};
