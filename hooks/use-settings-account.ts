import axios from 'axios';
import { useQuery, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { UserList } from './use-members';
import { useAuthStore } from '@/store/store';
import { requestPost, requestPut } from '@/lib/apiClient';

// 유저 정보 수정하고 나서 토큰 재발급
export const getReJWTToken = async () => {
  const EXPIRES_IN = 3600;

  const res = await requestPost('/api/v1/access-token/reissue', {
    body: {
      accessToken: sessionStorage.getItem('access_token'),
      refreshToken: sessionStorage.getItem('refresh_token'),
    },
  });

  if (res.code == 200) {
    const expiresAt = Date.now() + EXPIRES_IN * 1000; // Date.now()랑 expires의 시간 단위가 달라서 *1000 적용
    sessionStorage.setItem('access_token', res.data.accessToken);
    sessionStorage.setItem('refresh_token', res.data.refreshToken);
    sessionStorage.setItem('expires_at', String(expiresAt));
    // window.location.reload();
  }
};

//유저 정보 수정
export const modifyUserInfo = async (userKey: string, fullName: string, email: string) => {
  const res = await requestPut(`/api/v1/users/${userKey}`, {
    body: {
      email: email,
      fullName: fullName,
    },
  });

  return res.data;
};

//비밀번호 변경
export const changePassword = async (
  userKey: string,
  currentPassword: string,
  newPassword: string
) => {
  const res = await requestPost(`/api/v1/users/${userKey}/password/change`, {
    body: {
      currentPassword: currentPassword,
      newPassword: newPassword,
    },
  });

  return res;
};
