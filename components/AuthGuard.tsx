'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/store';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authStore = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const publicPaths = ['/', '/signup', '/signup/member']; // 로그인 페이지만 public
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const expiresAt = localStorage.getItem('expires_at');
    const isTokenExpired = expiresAt ? Date.now() > Number(expiresAt) : true;

    // public path면 바로 렌더
    if (publicPaths.includes(pathname)) {
      setIsReady(true);
      return;
    }

    // 토큰 없거나 만료 → 로그인 페이지
    if (!accessToken || !refreshToken || isTokenExpired) {
      authStore.clearAuth();
      router.replace('/');
      return;
    }

    // 상태가 이미 같은 값이면 setTokens 호출하지 않음 → 무한 루프 방지
    if (authStore.accessToken !== accessToken) {
      authStore.setTokens(accessToken, refreshToken, expiresAt || '');
    }

    setIsReady(true);
  }, [pathname, router, authStore.accessToken]);

  if (!isReady) return null; // 체크 전에는 렌더링하지 않음
  return <>{children}</>;
}
