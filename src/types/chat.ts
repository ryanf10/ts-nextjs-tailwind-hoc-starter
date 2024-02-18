import { User } from '@/types/user';

export type Chat = {
  id: string;
  user1: Omit<User, 'email' | 'roles'>;
  user2: Omit<User, 'email' | 'roles'>;
  lastMessage: string;
  lastMessageAt: string | null;
};
