import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { ModelData, CreateModelProps, ModifyModelProps } from '@/apis/models.api';
import { getModelList, createModel, modifyModel, deleteModel } from '@/apis/models.api';

// ✅ React Query Hook
export function useGetModelList(apiId: string, page?: number, size?: number) {
  return useQuery<ModelData[]>({
    queryKey: ['getModelList', apiId], // pathId별 캐싱
    queryFn: () => getModelList(apiId, page, size),
    enabled: !!apiId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// ✅ React Query Hook
export function useCreateModel(options: UseMutationOptions<any, Error, { apiId: string, tenantId: string, data: CreateModelProps }>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ apiId, tenantId, data }: { apiId: string, tenantId: string, data: CreateModelProps }) => createModel(apiId, tenantId, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getModelList'],
      });

      options.onSuccess?.(data, variables, context);
    },
  });
}

// ✅ React Query Hook
export function useModifyModel(
  options: UseMutationOptions<any, Error, { modelId: string; data: ModifyModelProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ modelId, data }: { modelId: string; data: ModifyModelProps }) =>
      modifyModel(modelId, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getModelList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}


// ✅ React Query Hook
export function useDeleteModel(
  options?: UseMutationOptions<any, Error, { modelId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ modelId }: { modelId: string }) => deleteModel(modelId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getModelList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
