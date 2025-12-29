

import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/store';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, user, setTokens, refreshToken, expiresAt } = useAuthStore.getState();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const publicPaths = ['/', '/signup', '/signup/member']; // 로그인 페이지만 public
    const isTokenExpired = expiresAt ? Date.now() > Number(expiresAt) : true;

    // public path면 바로 렌더
    if (publicPaths.includes(location.pathname)) {
      setIsReady(true);
      return;
    }

    // 토큰 없거나 만료 → 로그인 페이지
    if (!accessToken || !refreshToken || isTokenExpired) {
      clearAuth();
      navigate('/');
      return;
    }

    // 토큰이 스토어에 없으면 설정 (다음 렌더에서 user 확인)
    if (!accessToken) {
      setTokens(accessToken, refreshToken, expiresAt || '');
      return; // setTokens 호출 후 상태 변경으로 useEffect 재실행됨
    }

    // user가 준비되면 children 렌더링 허용
    if (user) {
      setIsReady(true);
    }
  }, [location.pathname, navigate, accessToken, user, setTokens, clearAuth]);

  if (!isReady) return null; // 체크 전에는 렌더링하지 않음
  return <>{children}</>;
}
