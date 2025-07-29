import axios from 'axios';
import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

export interface UserList {
  userKey: string;
  lastLoginAt: string | null;
  userId: string;
  password: string;
  fullName: string;
  email: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MemberList {
  userKey: string;
  lastLoginAt: string | null;
  userId: string;
  password: string;
  fullName: string;
  email: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  organizationId: string;
}

// 전체 유저 목록 조회 (super)
const getUserList = async (active?: boolean | 'all') => {
  let requestUrl = '';

  if (active === 'all') {
    requestUrl = '/api/v1/users';
  } else {
    requestUrl = `/api/v1/users?active=${active}`;
  }

  const { data } = await axios.get(requestUrl);

  return data;
};

export function useGetUserList(active: boolean) {
  return useQuery<UserList[]>({
    queryKey: ['getUserList'],
    queryFn: () => getUserList(active),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// 조직 멤버 조회 (admin)
const getMemberByOrganizationList = async (organizationId: string) => {
  const { data } = await axios.get(`/api/v1/organizations/${organizationId}/members`);

  return data;
};

export function useGetMemberByOrganizationList(organizationId: string) {
  return useQuery<MemberList[]>({
    queryKey: ['getMemberByOrganizationList'],
    queryFn: () => getMemberByOrganizationList(organizationId),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

interface handleStatusVariables {
  userKey: string;
  active?: boolean | 'all';
}

//조직 멤버 활성화 or 비활성화
const memberHandleStatus = async (userKey: string, active?: boolean | 'all') => {
  let requestUrl = '';

  if (active === 'all') {
    requestUrl = `/api/v1/users/${userKey}`;
  } else {
    requestUrl = `/api/v1/users/${userKey}?active=${active}`;
  }

  const { data } = await axios.patch(requestUrl);

  return data;
};

export function useMemberHandleStatus(
  options?: UseMutationOptions<any, Error, handleStatusVariables>
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: ({ userKey, active }: { userKey: string; active?: boolean | 'all' }) =>
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
  const { data } = await axios.post(`/api/v1/organizations/${organizationId}/members/${userKey}`);

  return data;
};

export function useDeleteMember(options?: UseMutationOptions<any, Error, DeleteMemberVariables>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, DeleteMemberVariables>({
    mutationFn: ({ organizationId, userKey }) => deleteMember(organizationId, userKey),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMemberByOrganizationList'],
      });
    },
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
  });
}

interface AddMemberVariables {
  organizationId: string;
  userId: string;
}

//조직 멤버 추가
const AddMember = async (organizationId: string, userId: string) => {
  const { data } = await axios.post(`/api/v1/organizations/${organizationId}/members`, {
    userId,
  });

  return data;
};

export function useAddMember(options?: UseMutationOptions<any, Error, AddMemberVariables>) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, AddMemberVariables>({
    mutationFn: ({ organizationId, userId }) => AddMember(organizationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMemberByOrganizationList'],
      });
    },
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
  });
}

//조직 멤버 임시 비밀번호 발급
export const issueTempPassword = async (userKey: string, options?: () => void) => {
  const { data } = await axios.post(`/api/v1/users/${userKey}/password/reset`);

  console.log(data);

  if (data?.success === undefined) {
    alert('비밀번호 발급에 성공하였습니다.');
    if (options) options();
  } else {
    alert(data?.message);
  }

  return data;
};
