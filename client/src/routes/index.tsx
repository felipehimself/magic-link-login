import { Link, useRoutes } from 'react-router-dom';
import { lazyImport } from '../utils/lazy-import';

const { Signin } = lazyImport(() => import('@/features/signin'), 'Signin');
const { Signup } = lazyImport(() => import('@/features/signup'), 'Signup');

export const AppRoutes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <Signin />,
    },
    {
      path: 'signup',
      element: <Signup />,
    },
    {
      path: 'register',
      element: (
        <div>
          Register <Link to="/">Go to home</Link>
        </div>
      ),
    },
  ]);

  return element;
};
