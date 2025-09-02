import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';

export interface ModelData {
  modelId: string;
  apiId: string;
  modelName: string;
  modelType: string;
  description: string;
  enabled: boolean;
  createdAt: string;
  createdBy: string;
}

// API 계획의 모델 목록 조회
const getModelList = async (apiId: string): Promise<ModelData[]> => {
  const res = await requestGet(`/api/v1/models/${apiId}`);
  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '모델 목록 조회 실패');
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

export interface ModelDetailData {
  modelId: string;
  apiId: string;
  modelName: string;
  modelType: string;
  description: string;
  version: string;
  enabled: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  usageInfo: {
    usageCount: number;
    usedByMethods: string[];
    lastUsed: string;
    popularityRank: string;
  };
  qualityMetrics: {
    schemaComplexity: number;
    validationCoverage: number;
    hasExamples: boolean;
    hasDocumentation: boolean;
    qualityScore: string;
  };
}

// API 계획의 모델 목록 조회
const getModelDetail = async (modelId: string): Promise<ModelDetailData[]> => {
  const res = await requestGet(`/api/v1/models/${modelId}`);
  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '모델 목록 조회 실패');
};

// ✅ React Query Hook
export function useGetModelDetail(modelId: string) {
  return useQuery<ModelDetailData[]>({
    queryKey: ['getModelDetail'], // pathId별 캐싱
    queryFn: () => getModelDetail(modelId),
    enabled: !!modelId, // pathId 있을 때만 실행
    staleTime: Infinity, // 데이터 오래 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

interface validateModelProps {
  type: string;
  properties: {
    name: {
      type: string;
    };
    age: {
      type: string;
      minimum: number;
    };
  };
  required: string[];
}

// 모델 스키마 검증
const validateModel = async (modelId: string, data: validateModelProps) => {
  const res = await requestPost(`/api/v1/models/${modelId}/validate-schema`, data);

  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '모델 검증 실패');
};

// ✅ React Query Hook
export function useValidateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modelId, data }: { modelId: string; data: validateModelProps }) =>
      validateModel(modelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getModelList'],
      });
    },
  });
}

interface SchemaProps {
  type: string;
  properties: {
    id: {
      type: string;
      description: string;
    };
    name: {
      type: string;
      description: string;
    };
    email: {
      type: string;
      format: string;
      description: string;
    };
  };
  required: string[];
}

interface ExamplesProps {
  name: string;
  value: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateModelProps {
  apiId: string;
  modelName: string;
  modelType: string; //REQUEST
  description: string;
  version: string;
  jsonSchema: SchemaProps;
  title: string;
  contentType: string;
  schema: SchemaProps;
  examples: ExamplesProps[];
  createdBy: string;
}

// 모델 생성
const createModel = async (data: CreateModelProps) => {
  const res = await requestPost(`/api/v1/models`, data);

  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '모델 생성 실패');
};

// ✅ React Query Hook
export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateModelProps) => createModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getModelList'],
      });
    },
  });
}

interface ModifyModelProps {
  modelName: string;
  title: string;
  description: string;
  schema: {};
  examples: {}[];
  updatedBy: string;
}

// 모델 수정
const modifyModel = async (modelId: string, data: ModifyModelProps) => {
  const res = await requestPut(`/api/v1/models/${modelId}`, data);

  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '모델 수정 실패');
};

// ✅ React Query Hook
export function useModifyModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ modelId, data }: { modelId: string; data: ModifyModelProps }) =>
      modifyModel(modelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getModelList'],
      });
    },
  });
}

// 모델 삭제
const deleteModel = async (modelId: string) => {
  const res = await requestDelete(`/api/v1/models/${modelId}`);

  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '모델 삭제 실패');
};

// ✅ React Query Hook
export function useDeleteModel(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (modelId: string) => deleteModel(modelId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['getModelList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
