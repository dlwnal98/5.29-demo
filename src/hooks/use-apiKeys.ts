import axios from 'axios';
import { useQuery, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost } from '@/lib/apiClient';

export interface ApiKey {
  keyId: string;
  organizationId: string;
  name: string;
  key: string;
  keySecret?: string;
  enabled?: string | null;
  expiredAt: string;
  rateLimit: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string;
  description: string;
}

// 전체 API Key 조회
const getAPIKeyList = async (organizationId: string) => {
  const res = await requestGet(`/api/v1/apikey/${organizationId}`);
  if (res.code == 200) {
    return res.data;
  }
};
export function useGetAPIKeyList(organizationId: string) {
  return useQuery<ApiKey[]>({
    queryKey: ['getAPIKeyList', organizationId],
    queryFn: () => getAPIKeyList(organizationId),
    enabled: !!organizationId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
type CreateAPIKeyVariables = {
  userKey: string;
  keyName: string;
  description: string;
  organizationId: string;
};

const createAPIKey = async ({
  userKey,
  keyName,
  description,
  organizationId,
}: CreateAPIKeyVariables) => {
  const res = await requestPost(`/api/v1/apiKey`, {
    body: {
      userKey,
      keyName,
      description,
      organizationId,
    },
  });

  if (res.code == 200) {
    return res.data;
  }
  return res.data;
};

export function useCreateAPIKey(options?: UseMutationOptions<any, Error, CreateAPIKeyVariables>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateAPIKeyVariables>({
    ...options,
    mutationFn: createAPIKey, // 바로 전달 가능
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['getAPIKeyList'] });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

type ModifyAPIKeyVariables = {
  keyId: string;
  keyName: string;
  description: string;
};

// API Key 수정
const modifyAPIKey = async ({ keyId, keyName, description }: ModifyAPIKeyVariables) => {
  const res = await requestPatch(`/api/v1/apiKey/${keyId}`, {
    body: {
      keyName,
      description,
    },
  });

  if (res.code == 200) {
    return res.data;
  }
};

export function useModifyAPIKey(options?: UseMutationOptions<any, Error, ModifyAPIKeyVariables>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, ModifyAPIKeyVariables>({
    ...options,
    mutationFn: modifyAPIKey, // 바로 전달 가능
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['getAPIKeyList'] });
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// API Key 삭제
const deleteAPIKey = async (keyId: string) => {
  const res = await requestDelete(`/api/v1/apiKey/${keyId}`);

  if (res.code == 200) {
    return res.data;
  }
};

export function useDeleteAPIKey(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    ...options,
    mutationFn: deleteAPIKey, // 바로 전달 가능
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['getAPIKeyList'] });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
