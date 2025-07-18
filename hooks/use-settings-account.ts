import axios from 'axios';
import { useQuery, useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { UserList } from './use-members';

// 단일 유저 조회
const getUserData = async (userId: string) => {
  const { data } = await axios.get(`/api/v1/users/${userId}`);

  return data;
};

export function useGetUserData(userId: string) {
  return useQuery<UserList>({
    queryKey: ['getUserList'],
    queryFn: () => getUserData(userId),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

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

//유저 정보 수정
export const modifyUserInfo = async (
  userId: string,
  name: string,
  email: string,
  options?: () => void
) => {
  const { data } = await axios.put(`/api/v1/users/edit`, {
    userId: userId,
    email: email,
    name: name,
  });

  if (data?.success === undefined) {
    alert('유저정보 수정 성공하였습니다.');
    if (options) options();
  } else {
    alert(data?.message);
  }

  return data;
};

//비밀번호 변경
const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const { data } = await axios.post(`/api/v1/users/change-password`, {
    userId: userId,
    currentPassword: currentPassword,
    newPassword: newPassword,
  });

  return data;
};

export function useChangePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
  options?: UseMutationOptions<any, Error>
) {
  return useMutation({
    mutationFn: () => changePassword(userId, currentPassword, newPassword),
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
  });
}
