import * as React from 'react';

import Layout from '@/components/layout/Layout';

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
