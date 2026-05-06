import { useQuery, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { getEndpointsList, createEndpoint, modifyEndpoint, deleteEndpoint } from '@/apis/route-endpoints.api';
import { EndpointsData, CreateEndpointProps, ModifyEndpointProps } from '@/apis/route-endpoints.api';



export function useGetEndpointsList(tenantId: string) {
  return useQuery<EndpointsData[]>({
    queryKey: ['getEndpointsList', tenantId],
    queryFn: () => getEndpointsList(tenantId),
    enabled: !!tenantId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}



export function useCreateEndpoint(options?: UseMutationOptions<any, Error, CreateEndpointProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data) => createEndpoint(data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useModifyEndpoint(
  options?: UseMutationOptions<any, Error, { id: string; data: ModifyEndpointProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: { id: string; data: ModifyEndpointProps }) =>
      modifyEndpoint(id, data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}



export function useDeleteEndpoint(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id: string) => deleteEndpoint(id),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
