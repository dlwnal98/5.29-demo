import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { OpenAPIData, CreateResourceProps, resourceCorsConfig, ModifyResourceCorsProps, deploymentProps } from '@/apis/resources.api';
import { createResource, deleteResource, getOpenAPIDoc, getResourceCorsSettings, modifyResourceCorsSettings } from '@/apis/resources.api';
import { deployAPI } from '@/apis/resources.api';

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


export function useCreateResource(apiId: string, options?: UseMutationOptions<any, Error, CreateResourceProps>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateResourceProps>({
    ...options,
    mutationFn: (data: CreateResourceProps) => createResource(apiId, data),
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

export function useGetResourceCorsSettings(apiId: string, resourceId: string) {
  return useQuery<resourceCorsConfig[]>({
    queryKey: ['getResourceCorsSettings', apiId, resourceId],
    queryFn: () => getResourceCorsSettings(apiId, resourceId),
    enabled: !!apiId && !!resourceId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useModifyResourceCorsSettings(
  options?: UseMutationOptions<any, Error, { apiId: string, resourceId: string; data: ModifyResourceCorsProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ apiId, resourceId, data }: { apiId: string, resourceId: string; data: ModifyResourceCorsProps }) =>
      modifyResourceCorsSettings(apiId, resourceId, data),
    onSuccess: (data, variables, context) => {
      // 리소스 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc', variables.apiId],
      });
      // CORS 설정 데이터 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getResourceCorsSettings', variables.apiId, variables.resourceId],
      });
      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

interface DeleteResourceVars { apiId: string; resourceId: string };

export function useDeleteResource(options?: UseMutationOptions<any, Error, DeleteResourceVars>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, DeleteResourceVars>({
    ...options,
    mutationFn: ({ apiId, resourceId }: DeleteResourceVars) => deleteResource(apiId, resourceId),
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
