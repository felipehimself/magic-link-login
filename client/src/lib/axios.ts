import Axios from 'axios';

export const axiosInstance = async () => {
  const instance = Axios.create({
    // pegar pelo .env
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      const msg = error?.response?.data?.message;

      return Promise.reject(msg);
    },
  );

  return instance;
};
