import { axiosInstance } from '@/lib/axios';
import { createBrowserRouter, defer, Navigate } from 'react-router-dom';
import { lazyImport } from '../utils/lazy-import';

const { Home } = lazyImport(() => import('@/features/home'), 'Home');
const { AuthLayout } = lazyImport(
  () => import('@/layouts/auth-layout'),
  'AuthLayout',
);
const { Signin } = lazyImport(() => import('@/features/auth/signin'), 'Signin');
const { Signup } = lazyImport(() => import('@/features/auth/signup'), 'Signup');
const { ConfirmAccount } = lazyImport(
  () => import('@/features/auth/confirm-account/confirm-accout'),
  'ConfirmAccount',
);
const { Signing } = lazyImport(
  () => import('@/features/auth/signing'),
  'Signing',
);
const { ProtectedLayout } = lazyImport(
  () => import('@/layouts/protected-layout'),
  'ProtectedLayout',
);

export const appRoutes = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    loader: async () => {
      try {
        const axios = await axiosInstance();

        return defer({
          data: axios.post('/auth/is-signed-in'),
        });
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    children: [
      {
        path: 'signin',
        element: <Signin />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'confirm-account',
        element: <ConfirmAccount />,
        loader: async ({ request }) => {
          const axios = await axiosInstance();
          const url = new URL(request.url);
          const codeConfirmation = url.searchParams.get('codeConfirmation');
          const userId = url.searchParams.get('userId');

          try {
            const res = await axios.post(
              `/auth/confirm-account?userId=${userId}&codeConfirmation=${codeConfirmation}`,
            );
            return defer({
              success: res,
            });
          } catch (error) {
            console.log(error);

            return {
              success: false,
            };
          }
        },
      },

      {
        path: 'signing',
        element: <Signing />,
        loader: async ({ request }) => {
          const axios = await axiosInstance();
          const url = new URL(request.url);
          const token = url.searchParams.get('token');

          try {
            await axios.get(`auth/login/callback?token=${token}`);

            return defer({ success: true });
          } catch (error) {
            console.log(error);
            return {
              success: false,
            };
          }
        },
      },

      { index: true, element: <Navigate to="/signin" /> },
    ],
  },
  {
    path: 'home',
    element: <ProtectedLayout />,
    loader: async () => {
      try {
        const axios = await axiosInstance();

        return defer({
          data: axios.post('/auth/is-signed-in'),
        });
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: '*',
    element: <Navigate to="/signin" />,
  },
]);
