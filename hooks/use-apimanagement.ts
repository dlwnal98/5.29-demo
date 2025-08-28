import { useQueryClient, useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPost, requestPut } from '@/lib/apiClient';

interface APIListData {
  apiId: string;
  organizationId: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
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

export function useGetAPIList(organizationId: string, page?: number, size?: number) {
  return useQuery<APIListData[]>({
    queryKey: ['getAPIList', organizationId],
    queryFn: () => getAPIList(organizationId, page, size),
    enabled: !!organizationId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

interface CreateAPIProps {
  organizationId: string;
  ownerUserKey: string;
  name: string;
  description: string;
  createdBy: string;
}

//api 키 생성 + 실시간 목록 생성
const createAPI = async (data: CreateAPIProps) => {
  const res = await requestPost(`/api/v1/plans`, data);

  if (res.code == 200) {
    return res.data;
  }
};

export function useCreateAPI(options?: UseMutationOptions<any, Error, CreateAPIProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: (data: CreateAPIProps) => createAPI(data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

interface CloneCreateAPIProps {
  apiId: string;
  targetOrganizationId: string;
  newName: string;
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

export function useCloneCreateAPI(options?: UseMutationOptions<any, Error, CloneCreateAPIProps>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ apiId, targetOrganizationId, newName }: CloneCreateAPIProps) =>
      cloneCreateAPI(apiId, targetOrganizationId, newName),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}

interface ModifyAPIProps {
  name: string;
  description: string;
  updatedBy: string;
}

//api 키 수정 + 실시간 목록 생성
const modifyAPI = async (apiId: string, data: ModifyAPIProps) => {
  const res = await requestPut(`/api/v1/plans/${apiId}`, data);

  if (res.code == 200) {
    return res.data;
  }
};

export function useModifyAPI(
  options?: UseMutationOptions<any, Error, { apiId: string; data: ModifyAPIProps }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ apiId, data }: { apiId: string; data: ModifyAPIProps }) =>
      modifyAPI(apiId, data),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      options?.onSuccess?.(data, variables, context);
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

export function useDeleteAPI(options?: UseMutationOptions<any, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (apiId: string) => deleteAPI(apiId),
    onSuccess: (data, variables, context) => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getAPIList'],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}
