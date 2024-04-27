import { axiosInstance } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

type TSignin = {
  destination: string;
};

export const postSignin = async ({ destination }: TSignin) : Promise<AxiosResponse<null>> => {
  const axios = await axiosInstance();

  return axios.post('/signin', { destination });
};

type UseSigninOptions = {
  config?: MutationConfig<TSignin, typeof postSignin>;
};

export const useSignin = ({ config }: UseSigninOptions = {}) => {
  // react tost...

  return useMutation({
    // onMutate: async ({ destination }) => {},
    // onSuccess: () => {},

    // onError: () => {},
    ...config,

    mutationFn: postSignin,
  });
};
