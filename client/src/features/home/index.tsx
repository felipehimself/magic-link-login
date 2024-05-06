import { Loading } from '@/components/loading';
import { TIsSignedin } from '@/types';
import { useAsyncValue, useNavigate } from 'react-router-dom';
import styles from '../../styles/index.module.css';
import { useSignout } from './api/post-signout';

export const Home = () => {
  const { mutate, isLoading } = useSignout();

  const { username } = useAsyncValue() as TIsSignedin;

  const navigate = useNavigate();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        navigate('/signin');
      },
    });
  };

  return (
    <section className={`${styles.container} ${styles.textCenter}`}>
      <h3>Yeah, you made it! </h3>
      <p className={styles.mt}>You have successfully logged in! @{username}</p>
      <button onClick={handleLogout} disabled={isLoading} className={styles.mt}>
        Sign out
      </button>
      {isLoading && <Loading />}
    </section>
  );
};
