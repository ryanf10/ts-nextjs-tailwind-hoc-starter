'use client';
import withAuth from '@/components/hoc/withAuth';
import Typography from '@/components/typography/Typography';

import useAuthStore from '@/store/useAuthStore';

import { Role } from '@/types/role';
import { AuthUser } from '@/types/user';

export default withAuth(UserInfo, 'all');
function UserInfo() {
  const user = useAuthStore.useUser() as AuthUser;
  const role = useAuthStore.useRole() as Role;
  return (
    <>
      <Typography variant='h3'>Welcome {user.email}</Typography>
      <Typography variant='s1'>{role.name}</Typography>
    </>
  );
}
