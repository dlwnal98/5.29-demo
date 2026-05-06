// store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { decodeJWT } from '@/hooks/decodeToken';

interface DecodedUser {
  userKey: string;
  email: string;
  name: string;
  role: string;
  userId: string;
  organizationId?: string;
  organizationName?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: DecodedUser | null;
  setTokens: (accessToken: string, refreshToken: string, expiresAt: string) => void;
  clearAuth: () => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,

      // 이제 setTokens는 Storage를 직접 건드리지 않고 상태만 업데이트합니다.
      // persist가 자동으로 Storage에 저장해줍니다.
      setTokens: (accessToken, refreshToken, expiresAt) => {
        const decodedData = accessToken ? parseJwt(accessToken) : null;
        set({
          accessToken,
          refreshToken,
          expiresAt,
          user: decodedData,
        });
      },

      clearAuth: () => {
        set({ accessToken: null, refreshToken: null, expiresAt: null, user: null });
      },
    }),
    {
      name: 'auth-storage', // 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용 (탭 닫으면 삭제)  // storage를 명시하지 않으면 → localStorage가 기본값으로 사용됨
      // Storage에서 데이터를 읽어와 상태에 집어넣을 때 실행될 로직 (선택 사항)
      onRehydrateStorage: () => (state, error) => {
        console.log('인증 정보 복구 완료');
        if (error) {
          // sessionStorage 데이터가 깨졌거나 파싱 실패
          state?.clearAuth();
          return;
        }

        if (state?.expiresAt && Date.now() > Number(state.expiresAt)) {
          //복구된 토큰이 이미 만료됨
          state.clearAuth();
        }

      },
    }
  )
);

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
