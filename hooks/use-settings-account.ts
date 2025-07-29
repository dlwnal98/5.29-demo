import axios from 'axios';
import { useQuery, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { UserList } from './use-members';

// 단일 유저 조회
const getUserData = async (userId: string, userKey: string) => {
  const { data } = await axios.get(`/api/v1/users/${userKey}?userId=${userId}`);

  return data;
};

export function useGetUserData(userId: string, userKey: string) {
  return useQuery<UserList>({
    queryKey: ['getUserData'],
    queryFn: () => getUserData(userId, userKey),
    // enabled: !!instanceId, // instanceId가 있을 때만 실행
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

//유저 삭제
const deleteUser = async (userId: string, userKey: string) => {
  const { data } = await axios.delete(`/api/v1/users/${userKey}?userId=${userId}`);

  return data;
};

export function useDeleteUser(
  userId: string,
  userKey: string,
  options?: UseMutationOptions<any, Error>
) {
  return useMutation({
    mutationFn: () => deleteUser(userId, userKey),
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
  });
}

//유저 정보 수정
export const modifyUserInfo = async (
  userKey: string,
  fullName: string,
  email: string,
  options?: () => void
) => {
  const { data } = await axios.put(`/api/v1/users/${userKey}`, {
    email: email,
    fullName: fullName,
  });

  if (data?.success === undefined) {
    if (options) options();
  } else {
    alert(data?.message);
  }

  return data;
};

//비밀번호 변경
const changePassword = async (userKey: string, currentPassword: string, newPassword: string) => {
  const { data } = await axios.post(`/api/v1/users/${userKey}/password/change`, {
    currentPassword: currentPassword,
    newPassword: newPassword,
  });

  return data;
};

export function useChangePassword(
  userKey: string,
  currentPassword: string,
  newPassword: string,
  options?: UseMutationOptions<any, Error>
) {
  return useMutation({
    mutationFn: () => changePassword(userKey, currentPassword, newPassword),
    ...options, // 외부에서 onSuccess 등 콜백을 직접 지정
  });
}
