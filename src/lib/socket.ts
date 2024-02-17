import process from 'process';
import { io } from 'socket.io-client';

import { getFromLocalStorage } from '@/lib/helper';

export const notificationSocketConnect = () => {
  return io(process.env.NEXT_PUBLIC_BACKEND_URL ?? '', {
    path: '/notifications/socket.io',
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${getFromLocalStorage('token')}`,
        },
      },
    },
  });
};
