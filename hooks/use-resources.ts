import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPost, requestPut } from '@/lib/apiClient';

interface ResourceProps {
  resourceId: string;
  planId: string;
  resourceName: string;
  path: string;
  parentResourcfeId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
// Resource List 조회
const getResourceList = async () => {
  const res = await requestGet(`/api/v1/resources`);
  if (res.code == 200) {
    return res.data;
  }
};

export function useGetResourceList() {
  return useQuery<ResourceProps[]>({
    queryKey: ['getResourceList'],
    queryFn: () => getResourceList(),
    // enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

interface initialPathsProps {
  pathPattern: string;
  description?: string;
  pathOrder?: number;
}

//resource 생성 + 실시간 목록 생성
const createResource = async (
  apiId: string,
  resourceName: string,
  description: string,
  resourceType: string,
  initialPaths: initialPathsProps[]
) => {
  const res = await requestPost(`/api/v1/resources`, {
    apiId,
    resourceName,
    description,
    resourceType,
    initialPaths,
  });

  if (res.code == 200) {
    return res.data;
  }
};

export function useCreateAPI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      apiId,
      resourceName,
      description,
      resourceType,
      initialPaths,
    }: {
      apiId: string;
      resourceName: string;
      description: string;
      resourceType: string;
      initialPaths: initialPathsProps[];
    }) => createResource(apiId, resourceName, description, resourceType, initialPaths),
    onSuccess: () => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getResourceList'],
      });
    },
  });
}
