import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { ModelData, CreateModelProps, ModifyModelProps } from '@/apis/models.api';
import { getModelList, createModel, modifyModel, deleteModel } from '@/apis/models.api';

// ✅ React Query Hook
export function useGetModelList(apiId: string) {
  return useQuery<ModelData[]>({
    queryKey: ['getModelList', apiId], // pathId별 캐싱
    queryFn: () => getModelList(apiId),
    enabled: !!apiId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// ✅ React Query Hook
export function useCreateModel(options: UseMutationOptions<any, Error, CreateModelProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateModelProps) => createModel(data),
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
  options?: UseMutationOptions<any, Error, { modelId: string; userKey: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ modelId, userKey }) => deleteModel(modelId, userKey),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getModelList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
