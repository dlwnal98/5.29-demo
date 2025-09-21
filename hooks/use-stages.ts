import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';

interface StagesData {
  stageId: string;
  apiId: string;
  name: string;
  description: string;
  environmentType: string;
  isDefault: boolean;
  status: string;
  deployedDocId: string;
  version: string;
  createdAt: string;
  lastDeployedAt: string;
  lastDeployedBy: string;
}

// 전체 스테이지 목록 조회 Open API문서
const getStatesDocData = async (apiId: string) => {
  const res = await requestGet(`/api/v1/stages/api/${apiId}`);

  return res;
};

export function useGetStagesDocData(apiId: string) {
  return useQuery({
    queryKey: ['getStatesDocData', apiId], // pathId별 캐싱
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
    queryKey: ['getStatesList', organizationId], // pathId별 캐싱
    queryFn: () => getDeployHistoryData(organizationId, page, size),
    enabled: !!organizationId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// 스테이지 상세내용 조회 (전체 조회 response랑 데이터가 같아서 화면 구성에 따라 요청하면 됨)
const getStateDetailList = async (stageId: string): Promise<StagesData[]> => {
  const res = await requestGet(`/api/v1/stages/${stageId}`);
  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '스테이지 목록 조회 실패');
};

export function useGetStageDetailList(stageId: string) {
  return useQuery<StagesData[]>({
    queryKey: ['getStateDetailList', stageId], // pathId별 캐싱
    queryFn: () => getStateDetailList(stageId),
    enabled: !!stageId, // pathId 있을 때만 실행
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

      options?.onSuccess?.(data, variables, context);
    },
  });
}

interface handleStageStatusProps {
  status: string;
  reason: string;
  updatedBy: string;
}

// 스테이지 상태 관리
const handleStageStatus = async (stageId: string, data: handleStageStatusProps) => {
  const res = await requestPatch(`/api/v1/stages/${stageId}/status`, data);

  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '스테이지 상태 변경 실패');
};

export function useHandleStageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stageId, data }: { stageId: string; data: handleStageStatusProps }) =>
      handleStageStatus(stageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getStatesDocData'],
      });
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

interface activateDeploymentProps {
  activatedBy: string;
  activationNotes: string;
  immediateActivation: boolean;
}

// 배포 활성화
const activateDeployment = async (deploymentId: string, data: activateDeploymentProps) => {
  const res = await requestPost(`/api/v1/deployments/${deploymentId}/activate`, data);

  if (res.code == 200) {
    return res.data;
  }
};

export function useActivateDeployment() {
  return useMutation({
    mutationFn: ({ deploymentId, data }: { deploymentId: string; data: activateDeploymentProps }) =>
      activateDeployment(deploymentId, data),
    onSuccess: () => {},
  });
}

// 배포 비활성화
const deActivateDeployment = async (deploymentId: string, reason?: string) => {
  const res = await requestPost(`/api/v1/deployments/${deploymentId}/deactivate?reason=${reason}`);

  if (res.code == 200) {
    return res.data;
  }
};

export function useDeactivateDeployment() {
  return useMutation({
    mutationFn: ({ deploymentId, reason }: { deploymentId: string; reason?: string }) =>
      deActivateDeployment(deploymentId, reason),
    onSuccess: () => {},
  });
}

// 이전 배포 활성화
const activatePreviousDeployment = async (
  currentDeploymentId: string,
  targetDeploymentId: string,
  reason?: string
) => {
  const res = await requestPost(
    `/api/v1/deployments/${currentDeploymentId}/activate-previous?targetDeploymentId=${targetDeploymentId}&reason=${reason}`
  );

  if (res.code == 200) {
    return res.data;
  }
};

export function useActivatePreviousDeployment() {
  return useMutation({
    mutationFn: ({
      currentDeploymentId,
      targetDeploymentId,
      reason,
    }: {
      currentDeploymentId: string;
      targetDeploymentId: string;
      reason?: string;
    }) => activatePreviousDeployment(currentDeploymentId, targetDeploymentId, reason),
    onSuccess: () => {},
  });
}

interface deploymentHistoryData {
  deploymentId: string;
  version: string;
  status: string;
  description: string;
  createdAt: string;
  activatedAt: string;
  deactivatedAt: string;
  createdBy: string;
  duration: string;
}

// 스테이지별 배포 이력 조회
const getDeploymentHistoryList = async (
  stageId: string,
  page?: number,
  size?: number
): Promise<deploymentHistoryData[]> => {
  const res = await requestGet(
    `/api/v1/deployments/history?stageId=${stageId}&page=${page}&size=${size}`
  );
  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '배포 목록 조회 실패');
};

export function useGetDeploymentHistoryList(stageId: string, page?: number, size?: number) {
  return useQuery<deploymentHistoryData[]>({
    queryKey: ['getDeploymentHistoryList', stageId], // pathId별 캐싱
    queryFn: () => getDeploymentHistoryList(stageId),
    enabled: !!stageId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

interface deploymentDetailData {
  deploymentId: string;
  apiId: string;
  stageId: string;
  version: string;
  status: string;
  description: string;
  snapshotId: string;
  createdAt: string;
  activatedAt: string;
  createdBy: string;
  activatedBy: string;
}

// 배포 상세 조회
const getDeploymentDetail = async (deploymentId: string): Promise<deploymentDetailData[]> => {
  const res = await requestGet(`/api/v1/deployments/${deploymentId}`);
  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '배포 상세 내용 조회 실패');
};

export function useGetDeploymentDetail(deploymentId: string) {
  return useQuery<deploymentDetailData[]>({
    queryKey: ['getDeploymentDetail', deploymentId], // pathId별 캐싱
    queryFn: () => getDeploymentDetail(deploymentId),
    enabled: !!deploymentId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
