import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { logger } from '../../utils';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
      onError: (err: any) => {
        logger(err?.response?.data ?? err);
      },
    },
    queries: {
      retry: false,
      onError: (err: any) => {
        logger(err?.response?.data ?? err);
      },
    },
  },
});

const ReactQueryProvider: React.FC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
