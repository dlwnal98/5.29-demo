import axios from 'axios';
import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

export interface UserList {
  tenantId: string;
  userId: string;
  password: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// 전체 유저 목록 조회
const getUserList = async (active: boolean) => {
  const { data } = await axios.get(`/api/v1/users?active=${active}`);

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

//유저 활성화
const userActivate = async (userId: string) => {
  const { data } = await axios.post(`/api/v1/users/${userId}/activate`);

  return data;
};

export function useUserActivate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userActivate(userId),
    onSuccess: () => {
      console.log('활성화');
      queryClient.invalidateQueries({ queryKey: ['getUserList'] });
    },
  });
}

//유저 비활성화
const userInactivate = async (userId: string) => {
  const { data } = await axios.post(`/api/v1/users/${userId}/deactivate`);

  return data;
};

export function useUserInactivate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userInactivate(userId),
    onSuccess: () => {
      // 브랜치 생성 성공 시 목록 invalidate
      console.log('비활성화');
      queryClient.invalidateQueries({
        queryKey: ['getUserList'],
      });
    },
  });
}

// 테넌트 검색 유저 조회
const getUserByTenantList = async (tenantId: string) => {
  const { data } = await axios.get(`/api/v1/users/tenant/${tenantId}`);

  return data;
};

export function useGetUserByTenantList(tenantId: string) {
  return useQuery<UserList[]>({
    queryKey: ['getUserByTenantList'],
    queryFn: () => getUserByTenantList(tenantId),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

// 활성화 여부 유저 조회 -> 일단 보류
// const getUserByActiveList = async (active: boolean) => {
//   const { data } = await axios.get(`/api/v1/users/active?active=${active}`);

//   return data;
// };

// export function useGetUserByActiveList(active: boolean) {
//   return useQuery<UserList[]>({
//     queryKey: ['getUserByActiveList'],
//     queryFn: () => getUserByActiveList(active),
//     // enabled: !!instanceId, // instanceId가 있을 때만 실행
//     staleTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false,
//   });
// }

//유저 삭제
const deleteUser = async (userId: string) => {
  const { data } = await axios.post(`/api/v1/users/${userId}/delete`);

  return data;
};

export function useDeleteUser(userId: string, options?: UseMutationOptions<any, Error>) {
  return useMutation({
    mutationFn: () => deleteUser(userId),
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
  });
}

//유저 임시 비밀번호 발급
export const issueTempPassword = async (
  userId: string,
  tempPassword = 'temp1234!',
  options?: () => void
) => {
  const { data } = await axios.post(`/api/v1/users/reset-password`, {
    userId: userId,
    tempPassword: 'temp1234!',
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

// export function useIssueTempPassword() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (userId: string, tempPassword = 'temp1234!') =>
//       issueTempPassword(userId, tempPassword),
//     onSuccess: () => {
//       // 브랜치 생성 성공 시 목록 invalidate
//       console.log('유저 임시비밀번호 발급');
//       queryClient.invalidateQueries({
//         queryKey: ['getUserList'],
//       });
//     },
//   });
// }
