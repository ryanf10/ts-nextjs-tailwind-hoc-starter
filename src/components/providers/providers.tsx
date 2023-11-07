'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import React from 'react';

import Dialog from '@/components/dialog/Dialog';
import DismissableToast from '@/components/toast/DismissableToast';
const queryClient = new QueryClient({});
function Providers({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        enableColorScheme={false}
      >
        {children}

        <DismissableToast />
        <Dialog />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default Providers;
