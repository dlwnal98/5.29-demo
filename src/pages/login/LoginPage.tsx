import type React from 'react';
import { toast } from 'sonner';
import { useLoginData } from './hooks/useLoginData';
import { useLoginUIState } from './hooks/useLoginUIState';
import LoginPageView from './LoginPageView';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';


export default function LoginPage() {
  const uiState = useLoginUIState();
  const { login } = useLoginData();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');

    // 리다이렉트 이유가 있으면 toast로 표시
    const redirectReason = sessionStorage.getItem('auth_redirect_reason');
    if (redirectReason) {
      toast.error(redirectReason);
      sessionStorage.removeItem('auth_redirect_reason');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    uiState.setIsLoading(true);

    try {
      const result = await login(uiState.userId, uiState.password);

      if (result.success && result.redirectUrl) {
        sessionStorage.setItem('userId', uiState.userId);
        window.location.href = result.redirectUrl;
      } else {
        if (result.errorMessage) {
          toast.error(result.errorMessage);
        }

        // 멤버 최초 로그인 성공해서 비밀번호 설정해야할 때
        if (result.code === 3005) {
          sessionStorage.setItem('userId', uiState.userId);
          window.location.href = '/signup/member';
        }
      }
    } catch (e) {
      uiState.setError('로그인 중 오류가 발생했습니다.');
    } finally {
      uiState.setIsLoading(false);
    }
  };

  return (
    <LoginPageView
      userId={uiState.userId}
      password={uiState.password}
      showPassword={uiState.showPassword}
      isLoading={uiState.isLoading}
      idValid={uiState.idValid}
      idValidMsg={uiState.idValidMsg}
      passwordValid={uiState.passwordValid}
      passwordValidMsg={uiState.passwordValidMsg}
      canSubmit={uiState.canSubmit}
      onUserIdChange={uiState.handleUserIdChange}
      onPasswordChange={uiState.handlePasswordChange}
      onUserIdKeyUp={uiState.validateUserId}
      onPasswordKeyUp={uiState.validatePassword}
      onToggleShowPassword={uiState.toggleShowPassword}
      onSubmit={handleSubmit}
    />
  );
}
