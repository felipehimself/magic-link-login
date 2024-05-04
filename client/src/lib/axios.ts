import Axios from 'axios';

export const axiosInstance = async () => {
  const instance = Axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          await refreshToken();

          return instance(originalRequest);
        } catch (refreshError) {
          window.location.href = '/signin';
          return Promise.reject(refreshError);
        }
      }

      const msg = error?.response?.data?.message;

      return Promise.reject(msg);
    },
  );

  return instance;
};

const refreshToken = async () => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
  }
};
