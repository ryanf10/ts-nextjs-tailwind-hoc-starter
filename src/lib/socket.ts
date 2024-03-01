import process from 'process';
import { io } from 'socket.io-client';

import { getFromLocalStorage } from '@/lib/helper';

export const notificationSocketConnect = () => {
  return io(process.env.NEXT_PUBLIC_BACKEND_URL ?? '', {
    path: '/notifications/socket.io',
    transports: ['websocket'],
    auth: {
      Authorization: `Bearer ${getFromLocalStorage('token')}`,
    },
  });
};

export const chatSocketConnect = () => {
  return io(process.env.NEXT_PUBLIC_BACKEND_URL ?? '', {
    path: '/chat/socket.io',
    transports: ['websocket'],
    auth: {
      Authorization: `Bearer ${getFromLocalStorage('token')}`,
    },
  });
};
