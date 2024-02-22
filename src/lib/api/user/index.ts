import { QueryFunction, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import axios from '@/lib/axios';

import { ApiError, ApiResponse } from '@/types/api';
import { AuthUser, User } from '@/types/user';

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
