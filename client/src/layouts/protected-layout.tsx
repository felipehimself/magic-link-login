import { PageLoading } from '@/components/page-loading';
import { TIsSignedin } from '@/types';
import { Suspense } from 'react';
import { Await, Navigate, Outlet, useLoaderData } from 'react-router-dom';

export const ProtectedLayout = () => {
  const { data } = useLoaderData() as { data: TIsSignedin };

  return (
    <Suspense fallback={<PageLoading />}>
      <Await
        key={'isSignedIn'}
        resolve={data}
        errorElement={<Navigate to="/signin" />}
      >
        {() => {
          return <Outlet context={data} />;
        }}
      </Await>
    </Suspense>
  );
};
