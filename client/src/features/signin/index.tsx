import { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useSignin } from './api/post-signin';
// import toast from ''
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
          toast.success('Check your e-mail to get you access link');
        },
        onError: (e: AxiosError) => {
          toast.error(e as unknown as string);
        },
      },
    );
  };

  return (
    <section className="container">
      <h3 className="text-center login-header">
        Welcome to Magic Link Project!
      </h3>

      <form noValidate onSubmit={handleSubmit} className="form">
        <div className="form-control">
          <input
            name="email"
            placeholder="Email"
            className="fit-container"
            type="email"
          />
          <small className="helper-text">{emailError}</small>
        </div>
        <button disabled={isLoading} className="fit-container">
          Login
        </button>
      </form>
      <p className="text-center mt">
        Click <Link to="/signup">here</Link> if you haven't registered yet
      </p>
      <p className="signin-footer">
        This is a simple project to show off how a Magic Link Login works :)
      </p>
    </section>
  );
};
