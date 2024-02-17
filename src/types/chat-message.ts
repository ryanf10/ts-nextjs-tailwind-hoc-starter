import { User } from '@/types/user';

export type ChatMessage = {
  id: string;
  sender: Omit<User, 'email' | 'roles'>;
  message: string;
  createdAt: string;
};
