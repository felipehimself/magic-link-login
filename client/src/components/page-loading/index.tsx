import { Loading } from '../loading';
import styles from './styles/index.module.css';

export const PageLoading = () => {
  return (
    <div className={styles.centerLoading}>
      <Loading />
    </div>
  );
};
