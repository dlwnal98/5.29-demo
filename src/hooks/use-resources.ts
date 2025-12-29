import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { OpenAPIData, CreateResourceProps, resourceCorsSettingsData, ModifyResourceProps, deploymentProps } from '@/api/resources.api';
import { createResource, deleteResource, getOpenAPIDoc, getResourceCorsSettings, modifyResourceCorsSettings } from '@/api/resources.api';
import { deployAPI } from '@/api/resources.api';

export function useGetOpenAPIDoc(apiId: string) {
  return useQuery<OpenAPIData>({
    queryKey: ['getOpenAPIDoc', apiId],
    queryFn: () => getOpenAPIDoc(apiId),
    enabled: !!apiId, // 조건적 실행
    // staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useCreateResource(options?: UseMutationOptions<any, Error, CreateResourceProps>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateResourceProps>({
    ...options,
    mutationFn: (data: CreateResourceProps) => createResource(data),
    onSuccess: (data, variables, context) => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc'],
      });
      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useGetResourceCorsSettings(resourceId: string) {
  return useQuery<resourceCorsSettingsData[]>({
    queryKey: ['getResourceCorsSettings'],
    queryFn: () => getResourceCorsSettings(resourceId),
    // enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useModifyResourceCorsSettings(
  options?: UseMutationOptions<any, Error, { resourceId: string; data: ModifyResourceProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ resourceId, data }: { resourceId: string; data: ModifyResourceProps }) =>
      modifyResourceCorsSettings(resourceId, data),
    onSuccess: (data, variables, context) => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc'],
      });
      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}


export function useDeleteResource(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    ...options,
    mutationFn: (resourceId: string) => deleteResource(resourceId),
    onSuccess: (data, variables, context) => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc'],
      });
      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}


export function useDeployAPI(options?: UseMutationOptions<any, Error, deploymentProps>) {
  return useMutation({
    ...options,
    mutationFn: (data: deploymentProps) => deployAPI(data),
    onSuccess: (data, variables, context) => {
      // ✅ getState()로 안전하게 Zustand 스토어에 접근

      // 기존 컴포넌트에서 전달한 onSuccess도 호출
      options?.onSuccess?.(data, variables, context);
    },
  });
}
