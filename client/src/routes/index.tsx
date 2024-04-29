// import { ConfirmAccount } from '@/features/auth/confirm-account/confirm-accout';
import SigninLayout from '@/layouts/signin-layout';
import { axiosInstance } from '@/lib/axios';
import { createBrowserRouter, defer, Navigate } from 'react-router-dom';
import { lazyImport } from '../utils/lazy-import';

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

export const appRoutes = createBrowserRouter([
  {
    path: '/',
    element: <SigninLayout />,
    loader: async () => {
      try {
        const axios = await axiosInstance();

        return defer({
          isSignedIn: axios.post('/auth/is-signed-in'),
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
    element: <div>Home!!</div>,
  },
  {
    path: '*',
    element: <Navigate to="/signin" />,
  },
]);
