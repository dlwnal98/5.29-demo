import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';
import { types } from 'util';

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
export interface QueryParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  example?: string;
}

export interface HeaderParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  example: string;
  schema?: {};
}

export interface PathParameter {
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

// 메서드 생성 DTO
export interface CreateMethodProps {
  resourceId: string;
  httpMethod: string;
  methodName: string;
  description?: string;
  backendServiceUrl: string;
  requestModelIds?: string[];
  responseModelId?: string;
  queryParameters: {
    name: string;
    type: string;
    required: boolean;
  }[];
  headerParameters: {
    name: string;
    type: string;
    required: boolean;
  }[];
  apiKeyId?: string;
  requiresApiKey?: boolean;
  requestValidator: string;
  createdBy: string;
}

// ✅ API 요청 함수
const createMethod = async (data: CreateMethodProps) => {
  const res = await requestPost(`/api/v1/methods`, {
    body: data,
  });

  return res;
};

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

// interface ModifyMethodProps {
//   methodName: string;
//   description: string;
//   backendServiceUrl: boolean;
//   requestSchema: {};
//   responseSchema: {};
//   requestModelId: string;
//   responseModelId: string;
//   queryParameters?: QueryParameter[];
//   headerParameters?: HeaderParameter[];
//   pathParameters?: PathParameter[];
//   updatedBy: string;
// }

interface ModifyMethodProps {
  methodName: string;
  description: string;
  backendServiceUrl: string;
  requestModelIds?: string[];
  responseModelId?: string;
  requestModelId?: string[];
  queryParameters?: [
    {
      name?: string;
      required?: boolean;
    },
  ];
  headerParameters?: [
    {
      name?: string;
      required?: boolean;
    },
  ];
  pathParameters?: [
    {
      name?: string;
      required?: boolean;
    },
  ];
  enabled: boolean;
  requestValidator: string;
  apiKeyRequired: false;
  updatedBy: string;
}

// ✅ API 요청 함수
const modifyMethod = async (methodId: string, data: ModifyMethodProps) => {
  const res = await requestPut(`/api/v1/methods/${methodId}`, {
    body: data,
  });

  return res;
};

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

// 요청검사기 데이터
export interface MethodsListProps {
  codeType: string;
  code: string;
  codeName: string;
  description: string;
  isActive: boolean;
}

// 요청검사기 목록 조회 API
const getValidatorList = async (codeType = 'REQUEST_VALIDATOR'): Promise<MethodsListProps[]> => {
  const res = await requestGet(`/api/v1/common-codes/${codeType}`);

  return res;
};

interface DeleteMethodProps {
  methodId: string;
  userKey: string;
}

// ✅ API 요청 함수
const deleteMethod = async (data: DeleteMethodProps) => {
  const res = await requestDelete(`/api/v1/methods/${data.methodId}`, {
    body: {
      headers: { 'X-User-Id': data.userKey },
    },
  });

  return res;
};

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
