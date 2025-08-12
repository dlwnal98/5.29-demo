import axios from 'axios';
import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { requestDelete, requestGet, requestPatch, requestPost } from '@/lib/apiClient';

export interface UserList {
  userKey: string;
  lastLoginAt: string | null;
  userId: string;
  password: string;
  fullName: string;
  email: string;
  enabled: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  organizationId: string;
}

interface MemberList {
  userKey: string;
  lastLoginAt: string | null;
  userId: string;
  password: string;
  fullName?: string;
  email?: string;
  enabled: number;
  createdAt: string;
  updatedAt: string;
  role: string;
  organizationId: string;
}

// 전체 유저 목록 조회 (super)
const getUserList = async (active: boolean | null) => {
  let requestUrl = '';

  if (active === null) {
    requestUrl = '/api/v1/users';
  } else {
    requestUrl = `/api/v1/users?active=${active}`;
  }

  const res = await requestGet(requestUrl);

  if (res.success == true) {
    return res.data;
  } else throw new Error(res.message ?? '전체 유저 목록 조회 실패');
};
export function useGetUserList(active: boolean | null, enabled: boolean) {
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

// 조직 멤버 조회 (admin)
const getMemberByOrganizationList = async (organizationId: string) => {
  const res = await requestGet(`/api/v1/organizations/${organizationId}/members`);
  if (res.success == true) {
    return res.data;
  } else throw new Error(res.message ?? '조직 멤버 목록 조회 실패');
};

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

interface handleStatusVariables {
  userKey: string;
  active: boolean;
}

//조직 멤버 활성화 or 비활성화
const memberHandleStatus = async (userKey: string, active: boolean) => {
  const res = await requestPatch(`/api/v1/users/${userKey}?active=${active}`);

  return res;
};

export function useMemberHandleStatus(
  options?: UseMutationOptions<any, Error, handleStatusVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: ({ userKey, active }: { userKey: string; active: boolean }) =>
      memberHandleStatus(userKey, active),
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

interface DeleteMemberVariables {
  organizationId: string;
  userKey: string;
}

//조직 멤버 삭제
const deleteMember = async (organizationId: string, userKey: string) => {
  const res = await requestDelete(`/api/v1/organizations/${organizationId}/members/${userKey}`);

  return res;
};

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

interface AddMemberVariables {
  organizationId: string;
  userId: string;
}

//조직 멤버 추가
const AddMember = async (organizationId: string, userId: string) => {
  const res = await requestPost(`/api/v1/organizations/${organizationId}/members`, {
    body: {
      userId,
    },
  });

  return res;
};

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
