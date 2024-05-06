import { PageLoading } from '@/components/page-loading';
import { TIsSignedin } from '@/types';
import { Suspense } from 'react';
import { Await, Navigate, Outlet, useLoaderData } from 'react-router-dom';

export const AuthLayout = () => {
  const { data } = useLoaderData() as { data: TIsSignedin };

  return (
    <Suspense fallback={<PageLoading />}>
      <Await key='auth-layout' resolve={data} errorElement={<Outlet />}>
        {() => {
          return <Navigate to="/home" />;
        }}
      </Await>
    </Suspense>
  );
};
