import axios from 'axios';

// 요청 전 인터셉터
axios.interceptors.request.use(
  async (config) => {
    const accessToken = sessionStorage.getItem('access_token');
    const refreshToken = sessionStorage.getItem('refresh_token');
    const expiresAt = sessionStorage.getItem('expires_at');

    if (accessToken && expiresAt) {
      const currentTime = Date.now();

      if (parseInt(expiresAt) - currentTime < 60 * 1000) {
        try {
          const res = await axios.post('/api/v1/access-token/reissue', {
            accessToken,
            refreshToken,
          });

          const newAccessToken = res.data.accessToken;
          const newRefreshToken = res.data.newRefreshToken;
          const EXPIRES_IN = 3600;
          const newExpiresAt = Date.now() + EXPIRES_IN * 1000;

          sessionStorage.setItem('access_token', newAccessToken);
          sessionStorage.setItem('refresh_token', newRefreshToken);
          sessionStorage.setItem('expires_at', String(newExpiresAt));

          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (err) {
          sessionStorage.clear();
          window.location.replace('/'); // ✅ 수정된 부분
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

// 요청 후 토큰 만료 감지해서 재발급
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refresh_token = sessionStorage.getItem('refresh_token');
    const access_token = sessionStorage.getItem('access_token');

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post('/api/v1/access-token/reissue', {
          refreshToken: refresh_token,
          accessToken: access_token,
        });

        const newAccessToken = refreshRes.data.accessToken;
        const newRefreshToken = refreshRes.data.newRefreshToken;
        const EXPIRES_IN = 3600;
        const newExpiresAt = Date.now() + EXPIRES_IN * 1000;

        sessionStorage.setItem('access_token', newAccessToken);
        sessionStorage.setItem('refresh_token', newRefreshToken);
        sessionStorage.setItem('expires_at', String(newExpiresAt));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        sessionStorage.clear();
        window.location.replace('/'); // ✅ 수정된 부분
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
