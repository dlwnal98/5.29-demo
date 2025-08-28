import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';

// 메서드 리스트 타입
export interface MethodsListProps {
  methodId: string;
  resourceId: string;
  pathId: string;
  httpMethod: string;
  methodName: string;
  description: string;
  targetEndpoint: string;
  requiresAuthentication: boolean;
  apiKeyRequired: boolean;
  integrationType: string;
  requestValidator: string;
  enabled: boolean;
  createdAt: string;
  createdBy: string;
}

// ✅ 리소스 경로의 메서드 목록 조회 API
const getMethodsList = async (pathId: string): Promise<MethodsListProps[]> => {
  const res = await requestGet(`/api/v1/methods/path/${pathId}`);
  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '메서드 목록 조회 실패');
};

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

// 공통 파라미터 타입
interface QueryParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  example?: string;
}

interface HeaderParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  example: string;
  schema?: {};
}

interface PathParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  example?: string;
  schema?: {
    type: string;
    pattern: string;
  };
}

interface ResponseSchemaProps {
  type: string;
  properties: {
    id: {
      type: string;
    };
    name: {
      type: string;
    };
    email: {
      type: string;
    };
    createdAt?: {
      type: string;
      format: string;
    };
  };
}

interface RequestSchemaProps {
  type: string;
  properties: {
    name: {
      type: string;
    };
    email: {
      type: string;
    };
    password: {
      type: string;
    };
    required: string[];
  };
}

// 메서드 생성 DTO
export interface CreateMethodProps {
  pathId: string;
  resourceId: string;
  httpMethod: string;
  methodName: string;
  description: string;
  targetEndpoint: string;
  requiresAuthentication: boolean;
  // requestModelId: string;
  // responseModelId: string;
  // apiKeyId: string;
  createdBy: string;
  requiresApiKey: boolean;
  requestSchema?: RequestSchemaProps;
  queryParameters?: QueryParameter[];
  headerParameters?: HeaderParameter[];
  pathParameters?: PathParameter[];
  responseSchema: ResponseSchemaProps;
}

// ✅ API 요청 함수
const createMethod = async (data: CreateMethodProps) => {
  const res = await requestPost(`/api/v1/methods`, data);

  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '메서드 생성 실패');
};

// ✅ React Query Hook
export function useCreateMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMethodProps) => createMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMethodsList'],
      });
    },
  });
}

interface ModifyMethodProps {
  methodName: string;
  description: string;
  requiresAuthentication: boolean;
  requestSchema: {};
  responseSchema: {};
  requestModelId: string;
  responseModelId: string;
  queryParameters?: QueryParameter[];
  headerParameters?: HeaderParameter[];
  pathParameters?: PathParameter[];
  updatedBy: string;
}

// ✅ API 요청 함수
const modifyMethod = async (methodId: string, data: ModifyMethodProps) => {
  const res = await requestPost(`/api/v1/methods/${methodId}`, data);

  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || '메서드 생성 실패');
};

// ✅ React Query Hook 수정
export function useModifyMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    //mutationFn은 단일인자만 받기 때문에 여러 인자를 넣기 위해서는 하나의 객체로 묶어서 적용
    mutationFn: ({ methodId, data }: { methodId: string; data: ModifyMethodProps }) =>
      modifyMethod(methodId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMethodsList'],
      });
    },
  });
}

export const deleteMethod = async (methodId: string) => {
  const res = await requestDelete(`/api/v1/methods/${methodId}`);

  if (res.code == 200) {
    return res.data;
  }
  throw new Error(res.message);
};
