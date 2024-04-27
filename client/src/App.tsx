import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './providers';
import { AppRoutes } from './routes';

export const App = () => {
  return (
    <AppProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Suspense>
    </AppProvider>
  );
};
