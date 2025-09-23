import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestGet, requestPatch, requestPost, requestDelete } from '@/lib/apiClient';

interface OpenAPIData {
  openapi: string;
  info: Record<string, any>;
  components: Record<string, any>;
  paths: Record<string, any>;
}

// open api 문서 조회
const getOpenAPIDoc = async (apiId: string) => {
  const res = await requestGet(`/api/v1/plans/${apiId}/openapi`);
  return res;
};

export function useGetOpenAPIDoc(apiId: string) {
  return useQuery<OpenAPIData>({
    queryKey: ['getOpenAPIDoc', apiId],
    queryFn: () => getOpenAPIDoc(apiId),
    enabled: !!apiId, // 조건적 실행
    // staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

//resource 생성 + 실시간 목록 생성
export interface CreateResourceProps {
  apiId: string;
  resourceName: string;
  description?: string;
  path: string;
  enableCors: boolean;
  resourceType: 'REST';
  createdBy: string;
}

const createResource = async (data: CreateResourceProps) => {
  const res = await requestPost(`/api/v1/resources`, {
    body: data,
  });

  return res;
};

export function useCreateResource(options?: UseMutationOptions<any, Error, CreateResourceProps>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateResourceProps>({
    ...options,
    mutationFn: (data: CreateResourceProps) => createResource(data),
    onSuccess: (data, variables, context) => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc'],
      });
      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// Resource별 CORS 정책 조회
interface resourceCorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  allowCredentials: boolean;
  maxAge: number;
}

interface resourceCorsSettingsData {
  pathId: string;
  path: string;
  corsEnabled: boolean;
  corsConfig: resourceCorsConfig[];
}

const getResourceCorsSettings = async (resourceId: string) => {
  const res = await requestGet(`/api/v1/resources/${resourceId}/cors`);

  return res;
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

//Resource CORS  수정
interface ModifyResourceProps {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  allowCredentials?: boolean;
}

const modifyResourceCorsSettings = async (
  resourceId: string,
  enableCors: boolean,
  data: ModifyResourceProps
) => {
  const res = await requestPatch(
    `/api/v1/resources/${resourceId}/cors?enabledCors=${enableCors}`,
    data
  );

  return res;
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

//리소스 삭제 + 리소스 목록 갱신
const deleteResource = async (resourceId: string) => {
  const res = await requestDelete(`/api/v1/resources/${resourceId}`);

  return res;
};

export function useDeleteResource(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    ...options,
    mutationFn: (resourceId: string) => deleteResource(resourceId),
    onSuccess: (data, variables, context) => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getOpenAPIDoc'],
      });
      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// API 배포 실행
interface deploymentProps {
  apiId: string;
  stageId: string;
  version?: string;
  deployedBy: string;
  description?: string;
  metadata?: {
    jiraTicket?: string;
    reviewer?: string;
  };
}

const deployAPI = async (data: deploymentProps) => {
  const res = await requestPost(`/api/v1/deployments`, {
    body: data,
  });

  return res;
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
