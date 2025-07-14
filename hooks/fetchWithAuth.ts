// lib/fetchWithAuth.ts
import { useAuthToken } from '@/hooks/useAuthToken';
import axios from 'axios';

export const fetchWithAuth = async (
  input: RequestInfo,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('access_token');

  const res = await fetch(input, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
    },
    credentials: 'include', // refresh_token 쿠키 포함
  });

  if (res.status !== 401) {
    return res;
  }

  // 🔄 access_token 만료 시 자동 재발급
  const refreshRes = await fetch('/api/v1/access-token/reissue', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (!refreshRes.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await refreshRes.json();
  const newAccessToken = data.accessToken;

  if (!newAccessToken) {
    throw new Error('No new access token received');
  }

  localStorage.setItem('access_token', newAccessToken);

  // 요청 재시도
  return fetch(input, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${newAccessToken}`,
    },
    credentials: 'include',
  });
};
