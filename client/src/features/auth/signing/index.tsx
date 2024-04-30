import { Loading } from '@/components/loading';
import { TLoaderDataSuccess } from '@/types';
import { useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import styles from '../../../styles/index.module.css';

export const Signing = () => {
  const { success } = useLoaderData() as TLoaderDataSuccess;
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (success) {
        navigate('/home');
      }
    }, 3000);
  }, [success, navigate]);

  return (
    <div className={styles.centerFlexCol}>
      {success ? (
        <>
          <p>Successfully loged in!</p>
          <p>You are being redirected</p>
          <Loading />
        </>
      ) : (
        <>
          <p>Ooops!</p>
          <p>Invalid credentials</p>
          <p>
            Try <Link to="/signin">Signing in</Link>
          </p>
        </>
      )}
    </div>
  );
};
