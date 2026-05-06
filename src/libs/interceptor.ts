// import axios from 'axios';
import { useAuthStore } from '@/stores/store';
import { axiosInstance, axiosAuth } from './axios-Instance';

// 요청 전 인터셉터: 토큰 만료 1분 전이면 재발급
axiosInstance.interceptors.request.use(
  async (config) => {
    const { accessToken, refreshToken, expiresAt, setTokens, clearAuth } = useAuthStore.getState();

    if (accessToken && expiresAt) {
      const currentTime = Date.now();

      // 만료 1분 전 감지 (expiresAt은 ms 단위라고 가정)
      if (parseInt(expiresAt) - currentTime < 60 * 1000) {
        try {
          const res = await axiosAuth.post('/api/v1/access-token/reissue', {
            accessToken,
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
          const EXPIRES_IN = 86400; // 1일 (24시간)
          const newExpiresAt = String(Date.now() + EXPIRES_IN * 1000);

          // ✅ Zustand 스토어 업데이트 (자동으로 스토리지까지 반영됨)
          setTokens(newAccessToken, newRefreshToken, newExpiresAt);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (err) {
          clearAuth();
          sessionStorage.setItem('auth_redirect_reason', '토큰이 만료되어 자동 갱신을 시도했으나 실패했습니다.');
          window.location.replace('/');
          return Promise.reject(err);
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 에러 발생 시 재발급 시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { accessToken, refreshToken, setTokens, clearAuth } = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axiosAuth.post('/api/v1/access-token/reissue', {
          refreshToken: refreshToken,
          accessToken: accessToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshRes.data;
        const EXPIRES_IN = 86400; // 1일 (24시간)
        const newExpiresAt = String(Date.now() + EXPIRES_IN * 1000);

        // ✅ Zustand 스토어 업데이트
        setTokens(newAccessToken, newRefreshToken, newExpiresAt);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // 재요청
      } catch (refreshError) {
        clearAuth();
        sessionStorage.setItem('auth_redirect_reason', '인증이 만료되었습니다. 다시 로그인해 주세요.');
        window.location.replace('/');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);