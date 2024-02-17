import { User } from '@/types/user';

export type Chat = {
  id: string;
  user1: Omit<User, 'roles'>;
  user2: Omit<User, 'roles'>;
  lastMessage: string;
  lastMessageAt: string;
};
