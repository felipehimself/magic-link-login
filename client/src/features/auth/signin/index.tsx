import { toaster } from '@/lib/toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../styles/index.module.css';
import { useSignin } from './api/post-signin';

export const Signin = () => {
  const [emailError, setEmailError] = useState('');

  const { mutate, isLoading } = useSignin();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError('');

    const form = event.currentTarget as HTMLFormElement;

    const formData = new FormData(form);

    const { email } = Object.fromEntries(formData);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string);

    if (!isValidEmail) return setEmailError('Invalid email address');

    mutate(
      { destination: email as string },
      {
        onSuccess: () => {
          form.reset();
          toaster('success', 'Check your e-mail to get your access link');
        },
      },
    );
  };

  return (
    <section className={styles.container}>
      <h3 className={`${styles.textCenter} ${styles.loginHeader}`}>
        Welcome to Magic Link Project!
      </h3>

      <form noValidate onSubmit={handleSubmit}>
        <div className={styles.formControl}>
          <input
            name="email"
            placeholder="Email"
            className={styles.fullWidth}
            type="email"
          />
          <small className={styles.helperText}>{emailError}</small>
        </div>
        <button disabled={isLoading} className={styles.fullWidth}>
          Login
        </button>
      </form>
      <p className={`${styles.textCenter} ${styles.mt} `}>
        Click <Link to="/signup">here</Link> if you haven't registered yet
      </p>
      <p className={styles.signinFooter}>
        This is a simple project to show off how a Magic Link Login works :)
      </p>
    </section>
  );
};
