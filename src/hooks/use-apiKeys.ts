import { useQuery, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiKey, CreateAPIKeyVariables, ModifyAPIKeyVariables } from '@/apis/api-keys.api';
import { getAPIKeyList, createAPIKey, modifyAPIKey, deleteAPIKey } from '@/apis/api-keys.api';

export function useGetAPIKeyList(tenantId: string) {
  return useQuery<ApiKey[]>({
    queryKey: ['getAPIKeyList', tenantId],
    queryFn: () => getAPIKeyList(tenantId),
    enabled: !!tenantId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useCreateAPIKey(options?: UseMutationOptions<any, Error, CreateAPIKeyVariables>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateAPIKeyVariables>({
    ...options,
    mutationFn: createAPIKey, // 바로 전달 가능
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['getAPIKeyList'] });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useModifyAPIKey(options?: UseMutationOptions<any, Error, ModifyAPIKeyVariables>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, ModifyAPIKeyVariables>({
    ...options,
    mutationFn: modifyAPIKey, // 바로 전달 가능
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['getAPIKeyList'] });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useDeleteAPIKey(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    ...options,
    mutationFn: deleteAPIKey, // 바로 전달 가능
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['getAPIKeyList'] });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
