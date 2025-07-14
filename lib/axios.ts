import axios from 'axios';
import { useRouter } from 'next/navigation';

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post('/api/auth/refresh', null, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem('access_token', newAccessToken);

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
