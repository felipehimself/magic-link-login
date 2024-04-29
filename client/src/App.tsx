import { Suspense } from 'react';
// import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './providers';
// import { AppRoutes } from './routes';
import { RouterProvider } from 'react-router-dom';
import { Loading } from './components/loading/loading';
import { appRoutes } from './routes';

export const App = () => {
  return (
    <AppProvider>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={appRoutes} />
      </Suspense>
    </AppProvider>
  );
};
