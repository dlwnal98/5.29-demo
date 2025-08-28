import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';

// open api 문서 조회
const getOpenAPIDoc = async (apiId: string) => {
  const res = await requestGet(`/api/v1/plans/${apiId}/openapi`);
  if (res.code == 200) {
    return res.data;
  }
};

export function useGetOpenAPIDoc(apiId: string) {
  return useQuery<any[]>({
    queryKey: ['getOpenAPIDoc'],
    queryFn: () => getOpenAPIDoc(apiId),
    enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

interface initialPathsProps {
  pathPattern: string;
  description?: string;
  pathOrder: number;
  httpMethods?: {
    method: string;
    description: string;
  }[];
}

export interface CreateResourceProps {
  apiId: string;
  resourceName: string;
  description: string;
  resourceType: string;
  initialPaths: initialPathsProps[];
  securitySettings: {
    authenticationRequired: boolean;
  };
  createdBy: string;
}

// open api 문서 조회
export const getResourceList = async (apiId: string) => {
  const res = await requestGet(`/api/v1/resources/plan/${apiId}`);
  if (res.code == 200) {
    return res.data.pathSummary?.pathPatterns;
  }
};

// export function useGetResourceList(apiId: string) {
//   return useQuery<any[]>({
//     queryKey: ['getResourceList'],
//     queryFn: () => getResourceList(apiId),
//     enabled: !!apiId, // 조건적 실행
//     staleTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false,
//   });
// }

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

// Resource 경로 검증
export const getResourceValidatePath = async (apiId: string, resourcePath: string) => {
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

interface resourceCorsSettingsData {
  pathId: string;
  path: string;
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
  return useQuery<resourceCorsSettingsData[]>({
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
  maxAge?: number;
  allowCredentials?: boolean;
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
  deploymentType: string;
  strategy: string;
  deploymentOptions: {
    autoActivate: boolean;
    runPreDeploymentValidation: boolean;
    runPostDeploymentValidation: boolean;
    enableAutoRollback: boolean;
    rollbackThreshold: number;
    timeoutMinutes: number;
  };
  deployedBy: string;
  metadata: {
    release_notes: string;
    jira_ticket: string;
  };
}

// API 배포 실행
const deployAPI = async (data: deploymentProps) => {
  const res = await requestPost(`/api/v1/deployments`, data);

  if (res.code == 200) {
    return res.data;
  }
};

export function useDeployAPI(options?: UseMutationOptions<any, Error, deploymentProps>) {
  return useMutation({
    ...options,
    mutationFn: (data: deploymentProps) => deployAPI(data),
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
  });
}
