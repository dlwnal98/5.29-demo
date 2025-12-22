import { useQuery, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { requestGet, requestDelete, requestPost, requestPut } from '@/lib/apiClient';

export interface EndpointsData {
  targetId: string;
  organizationId: string;
  targetEndpoint: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isValidUrl: boolean;
}

// Endpoints List 조회
const getEndpointsList = async (organizationId: string): Promise<EndpointsData[]> => {
  const res = await requestGet(`/api/v1/target-endpoints/organizations/${organizationId}`);

  return res;
};

export function useGetEndpointsList(organizationId: string) {
  return useQuery<EndpointsData[]>({
    queryKey: ['getEndpointsList', organizationId],
    queryFn: () => getEndpointsList(organizationId),
    enabled: !!organizationId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export interface CreateEndpointProps {
  organizationId: string;
  targetEndpoint: string;
  description: string;
  createdBy: string;
}

//Endpoints 생성
const createEndpoint = async (data: CreateEndpointProps) => {
  const res = await requestPost(`/api/v1/target-endpoints`, {
    body: data,
  });

  return res;
};

export function useCreateEndpoint(options?: UseMutationOptions<any, Error, CreateEndpointProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateEndpointProps) => createEndpoint(data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

interface ModifyEndpointProps {
  targetEndpoint: string;
  description: string;
  updatedBy: string;
}

//Endpoints 수정
const modifyEndpoint = async (targetId: string, data: ModifyEndpointProps) => {
  const res = await requestPut(`/api/v1/target-endpoints/${targetId}`, {
    body: data,
  });

  return res;
};

export function useModifyEndpoint(
  options?: UseMutationOptions<any, Error, { targetId: string; data: ModifyEndpointProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ targetId, data }: { targetId: string; data: ModifyEndpointProps }) =>
      modifyEndpoint(targetId, data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// Endpoints 삭제 (스테이지 삭제하면 엔드포인트도 다 삭제하게 만들어서 이거는 쓰지 말기)
const deleteEndpoint = async (targetId: string) => {
  const res = await requestDelete(`/api/v1/target-endpoints/${targetId}`);

  return res;
};

export function useDeleteEndpoint(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (targetId: string) => deleteEndpoint(targetId),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
