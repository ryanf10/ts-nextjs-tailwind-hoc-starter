import process from 'process';
import { io } from 'socket.io-client';

export const notificationSocketConnect = () => {
  return io(process.env.NEXT_PUBLIC_BACKEND_URL ?? '', {
    path: '/notifications/socket.io',
    transports: ['websocket'],
    withCredentials: true,
  });
};

export const chatSocketConnect = () => {
  return io(process.env.NEXT_PUBLIC_BACKEND_URL ?? '', {
    path: '/chat/socket.io',
    transports: ['websocket'],
    withCredentials: true,
  });
};
