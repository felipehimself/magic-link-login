import { AxiosError, AxiosResponse } from 'axios';
import {
  DefaultOptions,
  QueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from 'react-query';

const queryConfig: DefaultOptions = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<
  T,
  FnType extends (...args: T[]) => Promise<AxiosResponse<unknown>>,
> = Awaited<ReturnType<FnType>>;

export type QueryConfig<T, QueryFnType extends (...args: T[]) => Promise<AxiosResponse<unknown>>> = Omit<
  UseQueryOptions<ExtractFnReturnType<T, QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<
  T,
  MutationFnType extends (...args: T[]) => Promise<AxiosResponse<unknown>>,
> = UseMutationOptions<
  ExtractFnReturnType<T, MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;
