'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import Dialog from '@/components/dialog/Dialog';
import DismissableToast from '@/components/toast/DismissableToast';
const queryClient = new QueryClient({});
function Providers({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <DismissableToast />
      <Dialog />
    </QueryClientProvider>
  );
}

export default Providers;
