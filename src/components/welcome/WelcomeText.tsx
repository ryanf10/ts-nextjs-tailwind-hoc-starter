'use client';
import withAuth from '@/components/hoc/withAuth';
import Typography from '@/components/typography/Typography';

import useAuthStore from '@/store/useAuthStore';

import { AuthUser } from '@/types/user';

export default withAuth(WelcomeText, 'all');
function WelcomeText() {
  const user = useAuthStore.useUser() as AuthUser;
  return (
    <>
      <Typography variant='h3' className='dark:text-white'>
        Welcome {user.email}
      </Typography>
    </>
  );
}
