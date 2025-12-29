import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { MethodsListProps, CreateMethodProps, ModifyMethodProps, DeleteMethodProps } from '@/api/methods.api';
import { getMethodsList, createMethod, modifyMethod, deleteMethod } from '@/api/methods.api';

// ✅ React Query Hook
export function useGetMethodsList(pathId: string) {
  return useQuery<MethodsListProps[]>({
    queryKey: ['getMethodsList', pathId], // pathId별 캐싱
    queryFn: () => getMethodsList(pathId),
    enabled: !!pathId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// ✅ React Query Hook
export function useCreateMethod(options?: UseMutationOptions<any, Error, CreateMethodProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateMethodProps) => createMethod(data),
    onSuccess: (data, variables, context) => {
      // queryClient.invalidateQueries({
      //   queryKey: ['getOpenAPIDoc'],
      // });

      options?.onSuccess?.(data, variables, context);
    },
  });
}



// ✅ React Query Hook 수정
export function useModifyMethod(
  options?: UseMutationOptions<any, Error, { methodId: string; data: ModifyMethodProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    //mutationFn은 단일인자만 받기 때문에 여러 인자를 넣기 위해서는 하나의 객체로 묶어서 적용
    mutationFn: ({ methodId, data }: { methodId: string; data: ModifyMethodProps }) =>
      modifyMethod(methodId, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['getMethodsList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// ✅ 메서드 삭제
export function useDeleteMethod(options?: UseMutationOptions<any, Error, DeleteMethodProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: DeleteMethodProps) => deleteMethod(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc'],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}
