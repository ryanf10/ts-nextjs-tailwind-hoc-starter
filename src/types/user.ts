import { Role } from '@/types/role';

export type User = {
  id: string;
  email: string;
  username: string;
  roles: Array<Role>;
  createdAt: string;
};

export type AuthUser = User;
