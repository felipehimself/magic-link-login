// import { TSignup } from '@types';
import { TSignup } from '@/types';
import { useState } from 'react';
import { ArrowLeft } from '../../components/arrow-left';
import { validSignupForm } from './utils';

export const Signup = () => {
  const [erros, setErros] = useState<TSignup | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErros(null);

    const form = event.currentTarget as HTMLFormElement;

    const formData = new FormData(form);

    const { name, username, email } = Object.fromEntries(formData) as TSignup;

    const { hasError, formErros } = validSignupForm({ name, username, email });

    if (hasError) return setErros(formErros);

    //   form.reset();
  };

  return (
    <section className="container">
      <div className="login-header">
        <ArrowLeft />
        <p className="text-center">Register</p>
      </div>

      <form noValidate onSubmit={handleSubmit} className="form">
        <div className="form-control">
          <input
            name="name"
            placeholder="Name"
            className="fit-container"
            type="text"
          />
          <small className="helper-text">{erros?.name}</small>
        </div>
        <div className="form-control">
          <input
            name="username"
            placeholder="Username"
            className="fit-container"
            type="text"
          />
          <small className="helper-text">{erros?.username}</small>
        </div>
        <div className="form-control">
          <input
            name="email"
            placeholder="Email"
            className="fit-container"
            type="email"
          />
          <small className="helper-text">{erros?.email}</small>
        </div>
        <button className="fit-container">Signup</button>
      </form>
    </section>
  );
};
