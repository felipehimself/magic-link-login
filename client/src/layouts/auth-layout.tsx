import { PageLoading } from '@/components/page-loading';
import { TIsSignedin } from '@/types';
import { Suspense } from 'react';
import { Await, Navigate, Outlet, useLoaderData } from 'react-router-dom';

export const AuthLayout = () => {
  const { data } = useLoaderData() as { data: TIsSignedin };
  console.log(import.meta.env.VITE_API_URL);
  console.log(import.meta.env.VITE_API_URL);
  console.log('apu url: ', import.meta.env.VITE_API_URL);

  return (
    <Suspense fallback={<PageLoading />}>
      <Await key={'isSignedIn'} resolve={data} errorElement={<Outlet />}>
        {() => {
          return <Navigate to="/home" />;
        }}
      </Await>
    </Suspense>
  );
};
