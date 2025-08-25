import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';

interface ResourceData {
  resourceId: string;
  resourceName: string;
  description: string;
  planId: string;
  createdAt: string;
}

// 전체 Resource List 조회 (시스템 관리자용)
export const getAllResourceList = async () => {
  const res = await requestGet(`/api/v1/resources`);
  if (res.code == 200) {
    return res.data;
  }
};

// API 계획의 Resource List 조회
const getResourceList = async (apiId: string) => {
  const res = await requestGet(`/api/v1/resources/plan/${apiId}`);
  if (res.code == 200) {
    return res.data;
  }
};

export function useGetResourceList(apiId: string) {
  return useQuery<ResourceData[]>({
    queryKey: ['getResourceList'],
    queryFn: () => getResourceList(apiId),
    // enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Resource 상세 조회
const getResourceDetail = async (resourceId: string) => {
  const res = await requestGet(`/api/v1/resources/${resourceId}`);
  if (res.code == 200) {
    return res.data;
  }
};

export function useGetResourceDetail(resourceId: string) {
  return useQuery<ResourceData[]>({
    queryKey: ['getResourceDetail'],
    queryFn: () => getResourceDetail(resourceId),
    // enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// 리소스 트리 구조
export interface ResourceNode {
  resourceId: string;
  resourceName: string;
  level: number;
  children: ResourceNode[];
}

// API 응답 전체 구조
export interface ApiTreeResponse {
  apiId: string;
  tree: ResourceNode[];
}

// Resource 트리구조 조회
const getResourceTree = async (apiId: string) => {
  const res = await requestGet(`/api/v1/resources/tree/${apiId}`);
  if (res.code == 200) {
    return res.data;
  }
};

export function useGetResourceTree(apiId: string) {
  return useQuery<ApiTreeResponse[]>({
    queryKey: ['getResourceTree'],
    queryFn: () => getResourceTree(apiId),
    // enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// interface initialPathsProps {
//   pathPattern: string;
//   description?: string;
//   pathOrder?: number;
// }

export interface CreateResourceProps {
  planId: string;
  resourceName: string;
  description: string;
  // resourceType: string;
  // initialPaths: initialPathsProps[];
  // createdBy: string;
  resourcePath: string;
}

//resource 생성 + 실시간 목록 생성
const createResource = async (data: CreateResourceProps) => {
  const res = await requestPost(`/api/v1/resources`, data);

  if (res.code == 200) {
    return res.data;
  }
};

export function useCreateResource(options?: UseMutationOptions<any, Error, CreateResourceProps>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateResourceProps>({
    ...options,
    mutationFn: (data: CreateResourceProps) => createResource(data),
    onSuccess: (data, variables, context) => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getResourceList'],
      });
      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

interface validatePathProps {
  valid: boolean;
  path: string;
  errors: any[];
}

// Resource 경로 검증
const getResourceValidatePath = async (apiId: string, resourcePath: string) => {
  const res = await requestGet(
    `/api/v1/resources/validate-path?apiId=${apiId}&resourcePath=${resourcePath}`
  );

  if (res.code == 200) {
    return res.data;
  }
};

// export function useGetResourceValidatePath(apiId: string, resourcePath: string) {
//   return useQuery<validatePathProps[]>({
//     queryKey: ['getResourceValidatePath'],
//     queryFn: () => getResourceValidatePath(apiId, resourcePath),
//     // enabled: !!apiId, // 조건적 실행
//     staleTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false,
//   });
// }

interface resourceCorsConfig {
  allowOrigins: string[];
  allowMethods: string[];
  aloowHeaders: string[];
  exposeHeaders: string[];
  allowCredentials: boolean;
  maxAge: number;
}

interface resourceCorsSettings {
  pathId: string;
  pathPattern: string;
  corsEnabled: boolean;
  corsConfig: resourceCorsConfig[];
}

// Resource별 CORS 정책 조회
const getResourceCorsSettings = async (resourceId: string) => {
  const res = await requestGet(`/api/v1/resources/${resourceId}/cors`);

  if (res.code == 200) {
    return res.data;
  }
};

export function useGetResourceCorsSettings(resourceId: string) {
  return useQuery<resourceCorsSettings[]>({
    queryKey: ['getResourceCorsSettings'],
    queryFn: () => getResourceCorsSettings(resourceId),
    // enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

interface ModifyResourceProps {
  allowedOrigins?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
}

//resource Cors 설정 수정
const modifyResourceCorsSettings = async (
  resourceId: string,
  enableCors: boolean,
  data: ModifyResourceProps
) => {
  const res = await requestPatch(
    `/api/v1/resources/${resourceId}/cors?enabledCors=${enableCors}`,
    data
  );

  if (res.code == 200) {
    return res.data;
  }
};

export function useModifyResourceCorsSettings(
  options?: UseMutationOptions<
    any,
    Error,
    { resourceId: string; enableCors: boolean; data: ModifyResourceProps }
  >
) {
  return useMutation({
    ...options,
    mutationFn: ({
      resourceId,
      enableCors,
      data,
    }: {
      resourceId: string;
      enableCors: boolean;
      data: ModifyResourceProps;
    }) => modifyResourceCorsSettings(resourceId, enableCors, data),
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// API 배포 무결성 검증
const validateDeployment = async (deploymentId: string) => {
  const res = await requestPost(`/api/v1/deployments/${deploymentId}/validate`);

  if (res.code == 200) {
    return res.data;
  }
};

export function useValidateDeployment() {
  return useMutation({
    mutationFn: (deploymentId: string) => validateDeployment(deploymentId),
    onSuccess: () => {},
  });
}

interface deploymentProps {
  apiId: string;
  stageId: string;
  version: string;
  description: string;
  deploymentNotes: string;
  createdBy: string;
}

// API 배포 실행
const deployAPI = async (data: deploymentProps) => {
  const res = await requestPost(`/api/v1/deployments`, data);

  if (res.code == 200) {
    return res.data;
  }
};

export function useDeployAPI() {
  return useMutation({
    mutationFn: (data: deploymentProps) => deployAPI(data),
    onSuccess: () => {},
  });
}
