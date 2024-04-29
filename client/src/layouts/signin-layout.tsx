import { Loading } from '@/components/loading/loading';
import { Suspense } from 'react';
import { Await, Navigate, Outlet, useLoaderData } from 'react-router-dom';


const SigninLayout = () => {
  const { isSignedIn } = useLoaderData() as { isSignedIn: boolean };

  return (
    <Suspense fallback={<Loading />}>
      <Await key={'isSignedIn'} resolve={isSignedIn} errorElement={<Outlet />}>
        {() => {
          return <Navigate to="/home" />;
        }}
      </Await>
    </Suspense>
  );
};

export default SigninLayout;
