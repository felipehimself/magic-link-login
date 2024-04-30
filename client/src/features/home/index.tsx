import { TIsSignedin } from '@/types';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../../styles/index.module.css';
import { useSignout } from './api/post-signout';

export const Home = () => {
  const { mutate, isLoading } = useSignout();

  const navigate = useNavigate();

  const {
    _data: { username },
  } = useOutletContext<{ _data: TIsSignedin }>();

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
    </section>
  );
};
