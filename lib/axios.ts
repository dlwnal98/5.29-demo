import axios from 'axios';
import { useRouter } from 'next/navigation';

// 토큰 만료 감지해서 재발급
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh_token = localStorage.getItem('refresh_token');
    const access_token = localStorage.getItem('access_token');

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post('/api/v1/access-token/reissue', {
          refreshToken: refresh_token,
          accessToken: access_token,
        });

        const newAccessToken = refreshRes.data.accessToken;
        const newRefreshToken = refreshRes.data.newRefreshToken;
        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        // 기존 요청에 새로운 토큰 설정 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // refresh 실패 → 로그인 페이지로 이동
        const router = useRouter();
        router.replace('/');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
