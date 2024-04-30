import { axiosInstance } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { toaster } from '@/lib/toast';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

export const postSignout = async (): Promise<AxiosResponse<null>> => {
  const axios = await axiosInstance();

  return axios.post('/auth/signout');
};

type UseSignoutOptions = {
  config?: MutationConfig<null, typeof postSignout>;
};

export const useSignout = ({ config }: UseSignoutOptions = {}) => {
  return useMutation({
    onError: (e: AxiosError) => {
      toaster('error', e as unknown as string);
    },
    ...config,

    mutationFn: postSignout,
  });
};
