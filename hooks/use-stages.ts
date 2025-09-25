import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';

// 전체 스테이지 목록 조회 Open API문서
const getStatesDocData = async (apiId: string, path?: string) => {
  const res = await requestGet(`/api/v1/stages/api/${apiId}`);

  return res;
};

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

// 조직별 전체 배포이력 조회
const getDeployHistoryData = async (organizationId: string, page?: number, size?: number) => {
  const res = await requestGet(
    `/api/v1/deployments/history?organizationId=${organizationId}&page=${page}&size=${size}`
  );
  return res;
};

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

// 특정 배포 이력 Open API문서 (스냅샷 리소스 트리 조회)
const getDeploymentResourceTreeData = async (deploymentId: string) => {
  const res = await requestGet(`/api/v1/deployments/${deploymentId}/snapshot`);

  return res;
};

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

interface CreateStageProps {
  organizationId: string;
  stageName: string;
  description?: string;
  createdBy: string;
  enabled: true;
  deploymentSource: 'DRAFT' | 'PREVIOUS_DEVELOPMENT'; // 새 스테이지 생성시 'DRAFT', 옵션에서 스테이지 선택시 'PREVIOUS_DEVELOPMENT'
  apiId: string;
  sourceDeploymentId: string; // draft일 때는 없어도 됨
}

// 스테이지 생성
export const createStage = async (data: CreateStageProps) => {
  const res = await requestPost(`/api/v1/stages`, {
    body: data,
  });

  return res;
};

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

// 스테이지 삭제
const deleteStage = async (stageId: string, deletedBy: string) => {
  const res = await requestDelete(`/api/v1/stages/${stageId}?deletedBy=${deletedBy}`);

  return res;
};

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

// 스테이지 수정(설명만)
const modifyStage = async (stageId: string, description: string) => {
  const res = await requestPut(`/api/v1/stages/${stageId}/config`, {
    body: {
      description: description,
    },
  });

  return res;
};

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

interface PreviousDeploymentProps {
  stageId: string;
  targetDeploymentId: string;
  activatedBy?: string | null;
}

// 이전 배포 활성화
const activatePreviousDeployment = async (data: PreviousDeploymentProps) => {
  const res = await requestPost(
    `/api/v1/deployments/stages/${data.stageId}/activate-previous?targetDeploymentId=${data.targetDeploymentId}&activatedBy=${data.activatedBy}`
  );

  return res;
};

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
