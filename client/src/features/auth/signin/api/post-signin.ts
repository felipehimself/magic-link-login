import { axiosInstance } from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { toaster } from '@/lib/toast';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

type TSignin = {
  destination: string;
};

export const postSignin = async ({
  destination,
}: TSignin): Promise<AxiosResponse<null>> => {
  const axios = await axiosInstance();

  return axios.post('/auth/signin', { destination });
};

type UseSigninOptions = {
  config?: MutationConfig<TSignin, typeof postSignin>;
};

export const useSignin = ({ config }: UseSigninOptions = {}) => {
  // react tost...

  return useMutation({
    // onMutate: async ({ destination }) => {},
    // onSuccess: () => {},

    onError: (e: AxiosError) => {
      toaster('error', e as unknown as string);
    },
    ...config,

    mutationFn: postSignin,
  });
};
