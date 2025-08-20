import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost, requestPut } from '@/lib/apiClient';

interface EndpointsData {
  endpointId: string;
  stageId: string;
  baseUrl: string;
  fullEndpoint: string;
  path: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Endpoints List 조회
const getEndpointsList = async (stageId: string): Promise<EndpointsData[]> => {
  const res = await requestGet(`/api/v1/endpoints/stage/${stageId}`);
  if (res.code == 200) {
    return res.data;
  }
  throw new Error(res.message || '엔드포인트 목록 조회 실패');
};

export function useGetEndpointsList(stageId: string) {
  return useQuery<EndpointsData[]>({
    queryKey: ['getEndpointsList'],
    queryFn: () => getEndpointsList(stageId),
    // enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// Endpoints 상세 조회
const getEndpointDetail = async (endpointId: string): Promise<EndpointsData> => {
  const res = await requestGet(`/api/v1/endpoints/${endpointId}`);
  if (res.code == 200) {
    return res.data;
  }
  throw new Error(res.message || '엔드포인트 목록 조회 실패');
};

export function useGetEndpointDetail(endpointId: string) {
  return useQuery<EndpointsData>({
    queryKey: ['getEndpointDetail'],
    queryFn: () => getEndpointDetail(endpointId),
    // enabled: !!apiId, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

interface createEndpointProps {
  stageId: string;
  path: string;
  description: string;
  createdBy: string;
}

//Endpoints 생성
const createEndpoint = async (data: createEndpointProps) => {
  const res = await requestPost(`/api/v1/endpoints`, data);

  if (res.code == 200) {
    return res.data;
  }
};

export function useCreateEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: createEndpointProps) => createEndpoint(data),
    onSuccess: () => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
    },
  });
}

interface ModifyEndpointProps {
  path: string;
  description: string;
  updatedBy: string;
}

//Endpoints 수정
const modifyEndpoint = async (endpointId: string, data: ModifyEndpointProps) => {
  const res = await requestPut(`/api/v1/endpoints/${endpointId}`, data);

  if (res.code == 200) {
    return res.data;
  }
};

export function useModifyEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ endpointId, data }: { endpointId: string; data: ModifyEndpointProps }) =>
      modifyEndpoint(endpointId, data),
    onSuccess: () => {
      //   브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getEndpointsList'],
      });
    },
  });
}

//Endpoints 삭제 (스테이지 삭제하면 엔드포인트도 다 삭제하게 만들어서 이거는 쓰지 말기)
// const deleteEndpoint = async (endpointId: string) => {
//   const res = await requestDelete(`/api/v1/endpoints/${endpointId}`);

//   if (res.code == 200) {
//     return res.data;
//   }
// };

// export function useDeleteEndpoint() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (endpointId: string) => deleteEndpoint(endpointId),
//     onSuccess: () => {
//       //   브랜치 생성 성공 시 목록 invalidate
//       queryClient.invalidateQueries({
//         queryKey: ['getEndpointsList'],
//       });
//     },
//   });
// }
