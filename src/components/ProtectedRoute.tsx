import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/store';

export default function ProtectedRoute() {
  const { accessToken, refreshToken, expiresAt, clearAuth } = useAuthStore();
  const location = useLocation();

  // 1. 토큰 만료 여부 확인
  const isTokenExpired = expiresAt ? Date.now() > Number(expiresAt) : true;

  // 2. 인증 조건 체크 (토큰이 없거나 만료된 경우)
  if (!accessToken || !refreshToken || isTokenExpired) {
    clearAuth(); // 상태 초기화
    // 로그인 후 원래 가려던 페이지로 돌아오기 위해 state에 현재 위치 저장
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 3. 인증이 완료된 경우에만 하위 라우트 렌더링
  return <Outlet />;
};