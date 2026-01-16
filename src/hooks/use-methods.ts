import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { MethodsDetailDataProps, CreateMethodProps, ModifyMethodProps } from '@/apis/methods.api';
import { getMethodsDetailData, createMethod, modifyMethod, deleteMethod } from '@/apis/methods.api';

export function useGetMethodsDetailData(methodId: string) {
  return useQuery<MethodsDetailDataProps>({
    queryKey: ['getMethodsDetailData', methodId], // pathId별 캐싱
    queryFn: () => getMethodsDetailData(methodId),
    enabled: !!methodId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// ✅ React Query Hook
export function useCreateMethod(options?: UseMutationOptions<any, Error, { data: CreateMethodProps, apiId: string, resourceId: string }>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ data, apiId, resourceId }: { data: CreateMethodProps, apiId: string, resourceId: string }) => createMethod(data, apiId, resourceId),
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
        queryKey: ['getMethodsDetailData', variables.methodId],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// ✅ 메서드 삭제
export function useDeleteMethod(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (methodId: string) => deleteMethod(methodId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc'],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}
