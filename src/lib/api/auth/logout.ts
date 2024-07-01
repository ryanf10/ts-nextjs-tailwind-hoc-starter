import axios from '@/lib/axios';

import { ApiResponse } from '@/types/api';

export const callLogout = async () => {
  const res = await axios.post<ApiResponse<{ success: true }>>('/auth/logout');
  return res.data;
};
