import process from 'process';
import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? '', {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  },
});
