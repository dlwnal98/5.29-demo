import axios from 'axios';

export interface LoginResult {
  success: boolean;
  redirectUrl?: string;
  errorMessage?: string;
  code?: number;
}

export interface UseLoginDataReturn {
  login: (userId: string, password: string) => Promise<LoginResult>;
}

export function useLoginData(): UseLoginDataReturn {
  const login = async (userId: string, password: string): Promise<LoginResult> => {
    try {
      const res = await axios.post('/api/v1/code', {
        userId: userId,
        userPassword: password,
        redirectUri: `/auth-callback`,
      });

      console.log(res);

      // 로그인 성공했을 때
      if (!res?.data?.code) {
        return {
          success: true,
          redirectUrl: res.request.responseURL,
        };
      } else {
        // 로그인 실패했을 때
        return {
          success: false,
          errorMessage: res.data.message,
          code: res.data.code,
        };
      }
    } catch (e) {
      return {
        success: false,
        errorMessage: '로그인 중 오류가 발생했습니다.',
      };
    }
  };

  return {
    login,
  };
}
