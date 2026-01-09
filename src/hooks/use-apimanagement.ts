import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { APIListData, CreateAPIProps, ModifyAPIProps, CloneCreateAPIProps } from '@/apis/api-management.api';
import { getAPIList, createAPI, cloneCreateAPI, modifyAPI, deleteAPI } from '@/apis/api-management.api';

export function useGetAPIList(organizationId: string, page?: number, size?: number) {
  return useQuery<APIListData[]>({
    queryKey: ['getAPIList', organizationId, page, size],
    queryFn: () => getAPIList(organizationId, page, size),
    enabled: !!organizationId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useCreateAPI(options?: UseMutationOptions<any, Error, CreateAPIProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: (data: CreateAPIProps) => createAPI(data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useCloneCreateAPI(options?: UseMutationOptions<any, Error, CloneCreateAPIProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CloneCreateAPIProps) => cloneCreateAPI(data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useModifyAPI(
  options?: UseMutationOptions<any, Error, { apiId: string; data: ModifyAPIProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ apiId, data }: { apiId: string; data: ModifyAPIProps }) =>
      modifyAPI(apiId, data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useDeleteAPI(
  options?: UseMutationOptions<any, Error, { apiId: string; userKey: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ apiId, userKey }: { apiId: string; userKey: string }) =>
      deleteAPI(apiId, userKey),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}
