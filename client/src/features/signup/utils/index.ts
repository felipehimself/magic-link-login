import { TSignup } from '@types';
export const validSignupForm = ({name, username, email}: TSignup) => {
  const formErros = {} as TSignup;

  const trimName = name.trim();
  if (!trimName || trimName.length < 1 || trimName.length > 20) {
    formErros.name = 'Name must be at least 1 or 20 chracters long ';
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  console.log(isValidEmail);
  if (!isValidEmail) {
    formErros.email = 'Invalid email address';
  }

  const trimUsername = username.trim();

  if (!trimUsername || trimUsername.length < 1 || trimUsername.length > 12) {
    formErros.username = 'Username must be at least 1 or 12 chracters long ';
  }

  if (Object.values(formErros).length > 0) {
    return { hasError: true, formErros };
  }

  return { hasError: false, formErros: null };
};
