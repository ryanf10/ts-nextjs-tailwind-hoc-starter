import { QueryFunction, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import axios from '@/lib/axios';

import {
  ApiError,
  ApiResponse,
  BasePaginationResponseField,
  PaginatedApiResponse,
} from '@/types/api';
import { AuthUser, User } from '@/types/user';

export const userKey = 'user';

export const getAllUser: QueryFunction<
  PaginatedApiResponse<Array<User>>
> = async ({ queryKey }) => {
  const [_, url] = queryKey;
  const response = await axios.get<
    ApiResponse<
      {
        users: Array<User>;
      } & BasePaginationResponseField
    >
  >(url as string);

  const { users, ...rest } = response.data.data;
  const mockResponse: PaginatedApiResponse<Array<User>> = {
    ...rest,
    data: users,
    statusCode: response.data.statusCode,
  };
  return mockResponse;
};
export const searchUser: QueryFunction<
  PaginatedApiResponse<Array<Omit<User, 'email' | 'roles'>>>
> = async ({ queryKey }) => {
  const [_, url] = queryKey;
  const response = await axios.get<
    ApiResponse<
      {
        users: Array<Omit<User, 'email' | 'roles'>>;
      } & BasePaginationResponseField
    >
  >(url as string);

  const { users, ...rest } = response.data.data;
  const mockResponse: PaginatedApiResponse<
    Array<Omit<User, 'email' | 'roles'>>
  > = {
    ...rest,
    data: users,
    statusCode: response.data.statusCode,
  };
  return mockResponse;
};

export type UpdateProfilePictureParams = {
  picture: FileList;
};
export const useUpdateProfilePicture = () => {
  return useMutation<
    ApiResponse<AuthUser>,
    AxiosError<ApiError>,
    UpdateProfilePictureParams
  >({
    mutationFn: async ({ picture }: UpdateProfilePictureParams) => {
      const formData = new FormData();

      let tempPicture = null;
      if (picture && picture.length > 0) {
        const item = picture.item(0);
        if (item) {
          tempPicture = item;
        }
      }
      if (tempPicture) {
        formData.append('picture', tempPicture, tempPicture.name);
      }
      const res = await axios.patch<ApiResponse<AuthUser>>(
        '/user/profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    },
  });
};
