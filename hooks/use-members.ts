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

//조직 멤버 활성화 or 비활성화
const memberHandleStatus = async (userId: string, userKey: string, active?: boolean | 'all') => {
  let requestUrl = '';

  if (active === 'all') {
    requestUrl = `/api/v1/users/${userKey}?userId=${userId}`;
  } else {
    requestUrl = `/api/v1/users/${userKey}?userId=${userId}&active=${active}`;
  }

  const { data } = await axios.post(requestUrl);

  return data;
};

export function useMemberHandleStatus(userId: string, userKey: string, active?: boolean | 'all') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => memberHandleStatus(userId, userKey, active),
    onSuccess: () => {
      // 브랜치 생성 성공 시 목록 invalidate
      queryClient.invalidateQueries({
        queryKey: ['getMemberByOrganizationList'],
      });
    },
  });
}

//조직 멤버 삭제
const deleteMember = async (organizationId: string, userKey: string) => {
  const { data } = await axios.post(`/api/v1/organizations/${organizationId}/members/${userKey}`);

  return data;
};

export function useDeleteMember(
  organizationId: string,
  userKey: string,
  options?: UseMutationOptions<any, Error>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMember(organizationId, userKey),
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMemberByOrganizationList'],
      });
    },
  });
}

//조직 멤버 추가
const AddMember = async (organizationId: string, userId: string) => {
  const { data } = await axios.post(`/api/v1/organizations/${organizationId}/members`, {
    userId,
  });

  return data;
};

export function useAddMember(
  organizationId: string,
  userId: string,
  options?: UseMutationOptions<any, Error>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AddMember(organizationId, userId),
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getMemberByOrganizationList'],
      });
    },
  });
}

//조직 멤버 임시 비밀번호 발급
export const issueTempPassword = async (userId: string, userKey: string, options?: () => void) => {
  const { data } = await axios.post(`/api/v1/users/${userKey}/password/reset`, {
    userId: userId,
  });

  console.log(data);

  if (data?.success === undefined) {
    alert('비밀번호 발급에 성공하였습니다.');
    if (options) options();
  } else {
    alert(data?.message);
  }

  return data;
};
