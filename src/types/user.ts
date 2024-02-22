import { Role } from '@/types/role';

export type User = {
  id: string;
  email: string;
  username: string;
  roles: Array<Role>;
  createdAt: string;
  picture?: string;
};

export type AuthUser = User;
