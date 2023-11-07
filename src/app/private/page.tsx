'use client';
import withAuth from '@/components/hoc/withAuth';

export default withAuth(PrivatePage, 'all', ['admin']);
function PrivatePage() {
  return (
    <>
      This is private <></>
    </>
  );
}
