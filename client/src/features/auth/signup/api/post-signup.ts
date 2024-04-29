import { axiosInstance } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { toaster } from '@/lib/toast';
import { TSignup } from '@/types';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

export const postSignup = async (
  body: TSignup,
): Promise<AxiosResponse<null>> => {
  const axios = await axiosInstance();

  return axios.post('/auth/signup', body);
};

type UseSigninOptions = {
  config?: MutationConfig<TSignup, typeof postSignup>;
};

export const useSignup = ({ config }: UseSigninOptions = {}) => {
  return useMutation({
    onError: (e: AxiosError) => {
      toaster('error', e as unknown as string);
    },
    ...config,

    mutationFn: postSignup,
  });
};
