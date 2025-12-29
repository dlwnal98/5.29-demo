import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { OrganizationList } from '@/api/settings.api';
import { getOrganizationList, getSpecificOrganizationData, deleteOrganization, modifyOrganization } from '@/api/settings.api';

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
