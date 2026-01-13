import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { createStage, deleteStage, getDeployHistoryData, getDeploymentResourceTreeData, getStagesListData, getStagesOpenApiDocData, modifyStage } from '@/apis/stages.api';
import { CreateStageProps } from '@/apis/stages.api';
import { PreviousDeploymentProps } from '@/apis/stages.api';
import { activatePreviousDeployment } from '@/apis/stages.api';

export function useGetStagesListData(apiId: string) {
  return useQuery({
    queryKey: ['getStagesListData', apiId], // pathId별 캐싱
    queryFn: () => getStagesListData(apiId),
    enabled: !!apiId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}



export function useGetStagesDocData(stageId: string) {
  return useQuery({
    queryKey: ['getStatesDocData', stageId], // pathId별 캐싱
    queryFn: () => getStagesOpenApiDocData(stageId),
    enabled: !!stageId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useGetDeployHistoryData(tenantId: string, page?: number, size?: number) {
  return useQuery({
    queryKey: ['getDeployHistoryData', tenantId], // pathId별 캐싱
    queryFn: () => getDeployHistoryData(tenantId, page, size),
    enabled: !!tenantId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useGetDeploymentResourceTreeData(deploymentId: string) {
  return useQuery({
    queryKey: ['getDeploymentResourceTreeData', deploymentId], // pathId별 캐싱
    queryFn: () => getDeploymentResourceTreeData(deploymentId),
    enabled: !!deploymentId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}



export function useCreateStage(options?: UseMutationOptions<any, Error, CreateStageProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateStageProps) => createStage(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getStatesDocData'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getDeployHistoryData'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}


export function useDeleteStage(
  options?: UseMutationOptions<any, Error, { stageId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ stageId }: { stageId: string }) =>
      deleteStage(stageId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getStatesDocData'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}


export function useModifyStage(
  options?: UseMutationOptions<any, Error, { stageId: string; description: string; updatedBy: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ stageId, description, updatedBy }: { stageId: string; description: string; updatedBy: string }) =>
      modifyStage(stageId, description, updatedBy),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getStatesDocData'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}


export function useActivatePreviousDeployment(
  options?: UseMutationOptions<any, Error, { stageId: string; data: PreviousDeploymentProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ stageId, data }: { stageId: string; data: PreviousDeploymentProps }) => activatePreviousDeployment(stageId, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getDeployHistoryData'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['getStatesDocData'],
        exact: false,
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
