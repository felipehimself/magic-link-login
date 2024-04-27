import { queryClient } from '@/lib/react-query';
import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from 'react-query';
// error boundary...

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      {children}
    </QueryClientProvider>
  );
};
