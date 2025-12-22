import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';
import { headers } from 'next/headers';

export interface ModelData {
  modelId: string;
  apiId: string;
  modelName: string;
  description: string;
  version: string;
  jsonSchema: {
    type: string;
    properties: any;
  };
  properties?: any;
  examples?: any[];
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  planId?: string;
}

// API 계획의 모델 목록 조회
const getModelList = async (apiId: string): Promise<ModelData[]> => {
  const res = await requestGet(`/api/v1/models/plan/${apiId}`);

  return res;
};

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

export interface CreateModelProps {
  apiId: string;
  modelName: string;
  description: string;
  jsonSchema: {
    type: string;
    properties: {};
  };
  examples: {}[];
  createdBy: string;
}

// 모델 생성
const createModel = async (data: CreateModelProps) => {
  const res = await requestPost(`/api/v1/models`, {
    body: data,
  });

  return res;
};

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

export interface ModifyModelProps {
  modelName: string;
  description: string;
  version: string;
  jsonSchema: {
    type: string;
    properties: {};
  };
  properties: {};
  examples: {}[];
  updatedBy: string;
}

// 모델 수정
const modifyModel = async (modelId: string, data: ModifyModelProps) => {
  const res = await requestPut(`/api/v1/models/${modelId}`, {
    body: data,
  });

  return res;
};

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

// 모델 삭제
const deleteModel = async (modelId: string, userKey: string) => {
  const res = await requestDelete(`/api/v1/models/${modelId}`, {
    headers: {
      'X-User-Id': userKey,
    },
  });

  return res;
};

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
