import { Metadata } from 'next';

import Profile from '@/components/profile/Profile';
export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile Page',
};

export default function ProfilePage() {
  return (
    <>
      <Profile />
    </>
  );
}
