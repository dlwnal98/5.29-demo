import axios from 'axios';
import { useAuthStore } from '@/store/store';

// 요청 전 인터셉터: 토큰 만료 1분 전이면 재발급
axios.interceptors.request.use(
  async (config) => {
    const { accessToken, refreshToken, expiresAt, setTokens, clearAuth } = useAuthStore.getState();

    if (accessToken && expiresAt) {
      const currentTime = Date.now();

      // 만료 1분 전 감지 (expiresAt은 ms 단위라고 가정)
      if (parseInt(expiresAt) - currentTime < 60 * 1000) {
        try {
          const res = await axios.post('/api/v1/access-token/reissue', {
            accessToken,
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;
          const EXPIRES_IN = 3600;
          const newExpiresAt = String(Date.now() + EXPIRES_IN * 1000);

          // ✅ Zustand 스토어 업데이트 (자동으로 스토리지까지 반영됨)
          setTokens(newAccessToken, newRefreshToken, newExpiresAt);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (err) {
          clearAuth();
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
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { accessToken, refreshToken, setTokens, clearAuth } = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post('/api/v1/access-token/reissue', {
          refreshToken: refreshToken,
          accessToken: accessToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshRes.data;
        const EXPIRES_IN = 3600;
        const newExpiresAt = String(Date.now() + EXPIRES_IN * 1000);

        // ✅ Zustand 스토어 업데이트
        setTokens(newAccessToken, newRefreshToken, newExpiresAt);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest); // 재요청
      } catch (refreshError) {
        clearAuth();
        window.location.replace('/');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);