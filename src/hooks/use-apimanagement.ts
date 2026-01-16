import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { APIListData, CreateAPIProps, ModifyAPIProps, CloneCreateAPIProps } from '@/apis/api-management.api';
import { getAPIList, createAPI, cloneCreateAPI, modifyAPI, deleteAPI, uploadOpenAPIDocCreateAPI } from '@/apis/api-management.api';

export function useGetAPIList(tenantId: string, page?: number, size?: number) {
  return useQuery<APIListData[]>({
    queryKey: ['getAPIList', tenantId, page, size],
    queryFn: () => getAPIList(tenantId, page, size),
    enabled: !!tenantId, // 조건적 실행
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

export function useCloneCreateAPI(options?: UseMutationOptions<any, Error, { sourcePlanId: string; data: CloneCreateAPIProps }>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ sourcePlanId, data }: { sourcePlanId: string; data: CloneCreateAPIProps }) => cloneCreateAPI(sourcePlanId, data),
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

export function useUploadOpenAPIDocCreateAPI(options?: UseMutationOptions<any, Error, { tenantId: string; createdBy: string; data: string }>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ tenantId, createdBy, data }: { tenantId: string; createdBy: string; data: string }) => uploadOpenAPIDocCreateAPI(tenantId, createdBy, data),
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
    mutationFn: ({ apiId }: { apiId: string }) => deleteAPI(apiId),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}
