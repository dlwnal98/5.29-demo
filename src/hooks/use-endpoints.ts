import { useQuery, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { getEndpointsList, createEndpoint, modifyEndpoint, deleteEndpoint } from '@/api/routeEndpoints.api';
import { EndpointsData, CreateEndpointProps, ModifyEndpointProps } from '@/api/routeEndpoints.api';



export function useGetEndpointsList(organizationId: string) {
  return useQuery<EndpointsData[]>({
    queryKey: ['getEndpointsList', organizationId],
    queryFn: () => getEndpointsList(organizationId),
    enabled: !!organizationId, // 조건적 실행
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
    mutationFn: (data: CreateEndpointProps) => createEndpoint(data),
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
  options?: UseMutationOptions<any, Error, { targetId: string; data: ModifyEndpointProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ targetId, data }: { targetId: string; data: ModifyEndpointProps }) =>
      modifyEndpoint(targetId, data),
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
    mutationFn: (targetId: string) => deleteEndpoint(targetId),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
