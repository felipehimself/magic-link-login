import { Loading } from '@/components/loading';
import { useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import styles from '../../../styles/index.module.css';

import { TLoaderDataSuccess } from '@/types';

export const ConfirmAccount = () => {
  const { success } = useLoaderData() as TLoaderDataSuccess;

  const navigate = useNavigate();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (success) {
        navigate('/home');
      }

      return () => clearTimeout(timeOut);
    }, 3000);
  }, [success, navigate]);

  return (
    <div className={styles.centerFlexCol}>
      {success ? (
        <>
          <p>Your account has been confirmed!</p>
          <p>You are being redirected</p>
          <Loading />
        </>
      ) : (
        <>
          <p>Ooops!</p>
          <p>Invalid credentials</p>
          <p>
            Try <Link to="/signup">Signing up</Link>
          </p>
        </>
      )}
    </div>
  );
};
