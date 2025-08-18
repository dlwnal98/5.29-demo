import axios from 'axios';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPost, requestPut } from '@/lib/apiClient';

interface APIListProp {
  apiId: string;
  name: string;
  description: string;
  version: string;
  organizationId: string;
  userId: string;
  enabled: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// API List 조회
const getAPIList = async (organizationId: string, page?: number, size?: number) => {
  const res = await requestGet(
    `/api/v1/plans?organizationId=${organizationId}&page=${page}&size=${size}`
  );
  if (res.code == 200) {
    return res.data;
  }
};

export function useGetAPIList(organizationId: string) {
  return useQuery<APIListProp[]>({
    queryKey: ['getAPIList', organizationId],
    queryFn: () => getAPIList(organizationId),
    enabled: !!organizationId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

//api 키 생성 + 실시간 목록 생성
const createAPI = async (
  organizationId: string,
  ownerUserKey: string,
  name: string,
  description: string,
  createdBy: string
) => {
  const { data } = await axios.post(`/api/v1/plans`, {
    organizationId,
    ownerUserKey,
    name,
    description,
    createdBy,
  });

  return data;
};

export function useCreateAPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      ownerUserKey,
      name,
      description,
      createdBy,
    }: {
      organizationId: string;
      ownerUserKey: string;
      name: string;
      description: string;
      createdBy: string;
    }) => createAPI(organizationId, ownerUserKey, name, description, createdBy),
    onSuccess: () => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });
    },
  });
}

//api 복제하여 생성 + 실시간 목록 생성
const cloneCreateAPI = async (apiId: string, targetOrganizationId: string, newName: string) => {
  const res = await requestPost(
    `/api/v1/plans/${apiId}/clone?targetOrganizationId=${targetOrganizationId}&newName=${newName}`
  );

  if (res.code == 200) {
    return res.data;
  }
};

export function useCloneCreateAPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      apiId,
      targetOrganizationId,
      newName,
    }: {
      apiId: string;
      targetOrganizationId: string;
      newName: string;
    }) => cloneCreateAPI(apiId, targetOrganizationId, newName),
    onSuccess: () => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });
    },
  });
}

//api 키 수정 + 실시간 목록 생성
const modifyAPI = async (
  apiId: string,
  name: string,
  description: string,
  enabled: boolean,
  updatedBy: string
) => {
  const res = await requestPut(`/api/v1/plans/${apiId}`, {
    name,
    description,
    enabled,
    updatedBy,
  });

  if (res.code == 200) {
    return res.data;
  }
};

export function useModifyAPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      apiId,
      name,
      description,
      enabled,
      updatedBy,
    }: {
      apiId: string;
      name: string;
      description: string;
      enabled: boolean;
      updatedBy: string;
    }) => modifyAPI(apiId, name, description, enabled, updatedBy),
    onSuccess: () => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });
    },
  });
}

//api 키 삭제 + 실시간 목록 생성
const deleteAPI = async (apiId: string) => {
  const res = await requestDelete(`/api/v1/plans/${apiId}`);

  if (res.code == 200) {
    return res.data;
  }
};

export function useDeleteAPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ apiId }: { apiId: string }) => deleteAPI(apiId),
    onSuccess: () => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });
    },
  });
}

// API OpenAPI 문서 조회
export const viewOpenApiDoc = async (apiId: string) => {
  const res = await requestGet(`/api/v1/plans${apiId}/openapi`);
  if (res.code == 200) {
    return res.data;
  }
};
