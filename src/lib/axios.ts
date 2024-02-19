import axios from 'axios';
import * as process from 'process';

import { UninterceptedApiError } from '@/types/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(function (config) {
  if (!config.headers.Authorization) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token ? `Bearer ${token}` : '';
    }
  }
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    // parse error
    if (
      !axios.isCancel(error) &&
      axios.isAxiosError(error) &&
      error.response?.status == 401
    ) {
      if (error.config) {
        if (error.config?.headers && error.config?.headers['x-no-retry']) {
          return Promise.reject(error);
        }
        error.config.headers['x-no-retry'] = 'true';
        const res = await api.get('/auth/refresh', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
            'x-no-retry': 'true',
          },
        });

        const { access_token } = res.data.data;
        localStorage.setItem('token', access_token);

        error.config.headers.Authorization = `Bearer ${access_token}`;
        api.defaults.headers.Authorization = `Bearer ${access_token}`;
        return api(error.config);
      }
    } else if ((error.response?.data as UninterceptedApiError)?.message) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message:
              typeof (error.response?.data as UninterceptedApiError).message ===
              'string'
                ? (error.response?.data as UninterceptedApiError).message
                : Object.values(
                    (error.response?.data as UninterceptedApiError).message
                  )[0][0],
          },
        },
      });
    }
    return Promise.reject(error);
  }
);

export default api;
