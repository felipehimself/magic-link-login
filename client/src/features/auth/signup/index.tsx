import { ArrowLeft } from '@/components/arrow-left';
import { Loading } from '@/components/loading';
import { toaster } from '@/lib/toast';
import { signupSchema, TSignup } from '@/types';
import { searchFormErrors } from '@/utils/valid-form';
import { useState } from 'react';
import styles from '../../../styles/index.module.css';
import { useSignup } from './api/post-signup';

export const Signup = () => {
  const [erros, setErros] = useState<TSignup | null>(null);

  const { mutate, isLoading } = useSignup();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErros(null);

    const form = event.currentTarget as HTMLFormElement;

    const formData = new FormData(form);

    const { name, username, email } = Object.fromEntries(formData) as TSignup;

    const isValidForm = signupSchema.safeParse({ name, username, email });

    if (!isValidForm.success) {
      const formErrors = searchFormErrors(isValidForm.error);
      setErros(formErrors);
      return;
    }

    mutate(
      { name, username, email },
      {
        onSuccess: () => {
          form.reset();
          toaster('success', 'Check your e-mail to confirm your account');
        },
      },
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.loginHeader}>
        <ArrowLeft />
        <p className={styles.textCenter}>Register</p>
      </div>

      <fieldset disabled={isLoading}>
        <form noValidate onSubmit={handleSubmit}>
          <div className={styles.formControl}>
            <input
              name="name"
              placeholder="Name"
              className={styles.fullWidth}
              type="text"
            />
            <small className={styles.helperText}>{erros?.name}</small>
          </div>
          <div className={styles.formControl}>
            <input
              name="username"
              placeholder="Username"
              className={styles.fullWidth}
              type="text"
            />
            <small className={styles.helperText}>{erros?.username}</small>
          </div>
          <div className={styles.formControl}>
            <input
              name="email"
              placeholder="Email"
              className={styles.fullWidth}
              type="email"
            />
            <small className={styles.helperText}>{erros?.email}</small>
          </div>
          <button className={styles.fullWidth}>Signup</button>
        </form>
      </fieldset>
      {isLoading && <Loading />}
    </section>
  );
};
