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
    ApiResponse<{ token: { access_token?: string } }>,
    AxiosError<ApiError>,
    LoginParam
  >(async ({ email, password }: LoginParam) => {
    const res = await axios.post<
      ApiResponse<{ token: { access_token?: string } }>
    >('/auth/login', {
      email: email,
      password: password,
    });
    return res.data;
  }, {});
};
