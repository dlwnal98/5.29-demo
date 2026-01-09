import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { UserList, MemberList, AddMemberVariables, handleStatusVariables, DeleteMemberVariables } from '../types/member';
import { getUserList, getMemberByOrganizationList, memberHandleStatus, deleteMember, AddMember } from '../apis/members.api';


export function useGetUserList(active: string, enabled: boolean) {
  return useQuery<UserList[]>({
    queryKey: ['getUserList', active],
    queryFn: () => getUserList(active),
    enabled, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useGetMemberByOrganizationList(organizationId: string, enabled: boolean) {
  return useQuery<MemberList[]>({
    queryKey: ['getMemberByOrganizationList', organizationId],
    queryFn: () => getMemberByOrganizationList(organizationId),
    enabled, // 조건적 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}


export function useMemberHandleStatus(
  options?: UseMutationOptions<any, Error, handleStatusVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ userKey, active, role }: { userKey: string; active: boolean; role?: string }) =>
      memberHandleStatus(userKey, active),

    onSuccess: (data, variables, context) => {
      // role이 super인지 체크
      if (variables.role === 'SUPER') {
        queryClient.invalidateQueries({
          queryKey: ['getUserList'], // super용 queryKey
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ['getMemberByOrganizationList'], // 일반용 queryKey
        });
      }

      // 외부 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}


export function useDeleteMember(options?: UseMutationOptions<any, Error, DeleteMemberVariables>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, DeleteMemberVariables>({
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정

    mutationFn: ({ organizationId, userKey }) => deleteMember(organizationId, userKey),
    onSuccess: (data, variables, context) => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getMemberByOrganizationList'],
      });
      // 외부에서 넘겨준 onSuccess도 실행
      options?.onSuccess?.(data, variables, context);
    },
    onError: (err) => {
      console.log(err);
    },
  });
}



export function useAddMember(options?: UseMutationOptions<any, Error, AddMemberVariables>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, AddMemberVariables>({
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
    mutationFn: ({ organizationId, userId }) => AddMember(organizationId, userId),
    onSuccess: (data, variables, context) => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getMemberByOrganizationList'],
      });
      // 외부에서 넘겨준 onSuccess도 실행
      options?.onSuccess?.(data, variables, context);
    },
  });
}
