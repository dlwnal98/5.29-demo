// store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { decodeJWT } from '@/hooks/decodeToken';

interface DecodedUser {
  userKey: string;
  email: string;
  name: string;
  role: string;
  userId: string;
  organizationId?: string;
  organizationName?: string;
  // JWT에서 추출하는 필드에 따라 자유롭게 추가
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: DecodedUser | null;
  setTokens: (accessToken: string, refreshToken: string, expiresAt: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  user: null,
  setTokens: (accessToken, refreshToken, expiresAt) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expires_at', expiresAt);

    const decodedData = parseJwt(accessToken);
    set({
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
      user: decodedData,
    });
  },

  clearAuth: () => {
    localStorage.clear();
    set({ accessToken: null, refreshToken: null, expiresAt: null, user: null });
  },
}));

// JWT 디코딩 함수
function parseJwt(token: string): any {
  try {
    const decoded = decodeJWT(token);
    console.log(decoded);
    const decodedUserObj = {
      userKey: decoded?.userkey,
      userId: decoded?.sub,
      email: decoded?.email,
      name: decoded?.name,
      role: decoded?.role,
      organizationId: decoded?.organizationId,
      organizationName: decoded?.organizationName,
    };
    return decodedUserObj;
  } catch (e) {
    console.error('토큰 디코딩 실패:', e);
    return null;
  }
}

// 메서드 편집 모드 변경

interface MethodEditState {
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
}

export const useMethodEditStore = create<MethodEditState>((set) => ({
  isEdit: false,
  setIsEdit: (value) => set({ isEdit: value }),
}));
