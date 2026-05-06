import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/store';

export default function ProtectedRoute() {
  const { accessToken, refreshToken, expiresAt, clearAuth } = useAuthStore();
  const location = useLocation();

  // 1. 토큰 만료 여부 확인
  const isTokenExpired = expiresAt ? Date.now() > Number(expiresAt) : true;

  // 2. 인증 조건 체크 (토큰이 없거나 만료된 경우)
  if (!accessToken || !refreshToken || isTokenExpired) {
    // 리다이렉트 이유 저장
    if (!accessToken || !refreshToken) {
      sessionStorage.setItem('auth_redirect_reason', '로그인이 필요합니다.');
    } else if (isTokenExpired) {
      sessionStorage.setItem('auth_redirect_reason', '세션이 만료되었습니다. 다시 로그인해 주세요.');
    }
    clearAuth(); // 상태 초기화
    // 로그인 후 원래 가려던 페이지로 돌아오기 위해 state에 현재 위치 저장
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 3. 인증이 완료된 경우에만 하위 라우트 렌더링
  return <Outlet />;
};