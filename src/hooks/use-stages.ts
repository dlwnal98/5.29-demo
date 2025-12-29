import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { createStage, deleteStage, getDeployHistoryData, getDeploymentResourceTreeData, getStatesDocData, modifyStage } from '@/api/stages.api';
import { CreateStageProps } from '@/api/stages.api';
import { PreviousDeploymentProps } from '@/api/stages.api';
import { activatePreviousDeployment } from '@/api/stages.api';


export function useGetStagesDocData(apiId: string, path?: string) {
  return useQuery({
    queryKey: ['getStatesDocData', apiId, path], // pathId별 캐싱
    queryFn: () => getStatesDocData(apiId),
    enabled: !!apiId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useGetDeployHistoryData(organizationId: string, page?: number, size?: number) {
  return useQuery({
    queryKey: ['getDeployHistoryData', organizationId], // pathId별 캐싱
    queryFn: () => getDeployHistoryData(organizationId, page, size),
    enabled: !!organizationId, // pathId 있을 때만 실행
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
  options?: UseMutationOptions<any, Error, { stageId: string; deletedBy: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ stageId, deletedBy }: { stageId: string; deletedBy: string }) =>
      deleteStage(stageId, deletedBy),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getStatesDocData'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}


export function useModifyStage(
  options?: UseMutationOptions<any, Error, { stageId: string; description: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ stageId, description }: { stageId: string; description: string }) =>
      modifyStage(stageId, description),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getStatesDocData'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}


export function useActivatePreviousDeployment(
  options?: UseMutationOptions<any, Error, PreviousDeploymentProps>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: PreviousDeploymentProps) => activatePreviousDeployment(data),
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
