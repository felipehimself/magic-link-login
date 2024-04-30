import { Suspense } from 'react';
// import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './providers';
// import { AppRoutes } from './routes';
import { RouterProvider } from 'react-router-dom';
import { appRoutes } from './routes';
import { PageLoading } from './components/page-loading';

export const App = () => {
  return (
    <AppProvider>
      <Suspense fallback={<PageLoading />}>
        <RouterProvider router={appRoutes} />
      </Suspense>
    </AppProvider>
  );
};
