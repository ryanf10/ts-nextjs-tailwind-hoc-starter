'use client';
import withAuth from '@/components/hoc/withAuth';
import ButtonLink from '@/components/links/ButtonLink';

import useAuthStore from '@/store/useAuthStore';

export default withAuth(AuthButton, 'optional');

function AuthButton() {
  const user = useAuthStore.useUser();
  return (
    <ButtonLink href={user ? '/dashboard' : '/login'}>
      {user ? 'Dashboard' : 'Login'}
    </ButtonLink>
  );
}
