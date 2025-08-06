import axios from 'axios';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

interface OrganizationList {
  organizationId: string;
  organizationName: string;
  desciption: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string; // 조직 admin userKey 같은데..
}

// 모든 조직 조회
const getOrganizationList = async () => {
  const { data } = await axios.get(`/api/v1/organizations`);

  return data;
};

export function useGeOrganizationList() {
  return useQuery<OrganizationList[]>({
    queryKey: ['getOrganizationList'],
    queryFn: () => getOrganizationList(),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// 특정 조직 조회
const getSpecificOrganizationData = async (organizationName: string) => {
  const { data } = await axios.get(`/api/v1/organizations/name/${organizationName}`);

  return data;
};

export function useGetSpecificOrganizationData(organizationName: string) {
  return useQuery<OrganizationList[]>({
    queryKey: ['getSpecificOrganizationData'],
    queryFn: () => getSpecificOrganizationData(organizationName),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// 조직 삭제
const deleteOrganization = async (organizationId: string) => {
  const { data } = await axios.delete(`/api/v1/organizations/${organizationId}`);

  return data;
};

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) => deleteOrganization(organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getOrganizationList'],
      });
    },
  });
}

// 조직 수정
const modifyOrganization = async (
  organizationId: string,
  organizationName: string,
  description: string
) => {
  const { data } = await axios.put(`/api/v1/organizations/${organizationId}`, {
    organizationName: organizationName,
    description: description,
  });

  return data;
};

export function useModifyOrganization(
  organizationId: string,
  organizationName: string,
  description: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => modifyOrganization(organizationId, organizationName, description),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getOrganizationList'],
      });
    },
  });
}
