import { Role } from '@/types/role';

export type User = {
  id: string;
  email: string;
  roles: Array<Role>;
};

export type AuthUser = User;
