import axios from 'axios';
import { useQuery, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { UserList } from './use-members';
import { useAuthStore } from '@/store/store';

// 단일 유저 조회
// export const getUserData = async (userKey: string) => {
//   const { data } = await axios.get(`/api/v1/users/${userKey}`);

//   return data;
// };

// export function useGetUserData(userKey: string) {
//   return useQuery<UserList>({
//     queryKey: ['getUserData'],
//     queryFn: () => getUserData(userKey),
//     // enabled: !!instanceId, // instanceId가 있을 때만 실행
//     staleTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: false,
//   });
// }

//유저 삭제
export const deleteUser = async (userKey: string) => {
  const { data } = await axios.delete(`/api/v1/users/${userKey}`);

  return data;
};

// 유저 정보 수정하고 나서 토큰 재발급
export const getReJWTToken = async () => {
  const EXPIRES_IN = 3600;

  //주소는 아직 확실하지 않음
  const res = await axios.post('/api/v1/access-token/reissue', {
    //어떤 걸 request Data 로 보낼지는 아직 안됐음
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
  });

  if (res) {
    const expiresAt = Date.now() + EXPIRES_IN * 1000; // Date.now()랑 expires의 시간 단위가 달라서 *1000 적용
    localStorage.setItem('access_token', res.data.accessToken);
    localStorage.setItem('refresh_token', res.data.refreshToken);
    localStorage.setItem('expires_at', String(expiresAt));
  }
};

//유저 정보 수정
export const modifyUserInfo = async (userKey: string, fullName: string, email: string) => {
  const { data } = await axios.put(`/api/v1/users/${userKey}`, {
    email: email,
    fullName: fullName,
  });

  return data;
};

//비밀번호 변경
export const changePassword = async (
  userKey: string,
  currentPassword: string,
  newPassword: string
) => {
  const { data } = await axios.post(`/api/v1/users/${userKey}/password/change`, {
    currentPassword: currentPassword,
    newPassword: newPassword,
  });

  return data;
};
