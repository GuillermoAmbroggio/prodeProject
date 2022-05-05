import React, { Suspense } from 'react';
import ReactQueryProvider from './reactQueryProvider/ReactQueryProvider';

interface IProvidersProps {}

const Providers: React.FC<IProvidersProps> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <Suspense fallback={<p>Cargando...</p>}>{children}</Suspense>
    </ReactQueryProvider>
  );
};

export default Providers;
