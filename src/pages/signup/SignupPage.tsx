import type React from 'react';
import { useSignupData } from './hooks/useSignupData';
import { useSignupUIState } from './hooks/useSignupUIState';
import SignupPageView from './SignupPageView';

export default function SignupPage() {
  const uiState = useSignupUIState();
  const { checkUserIdExists, submitSignup } = useSignupData();

  const handleIdCheck = async (userId: string) => {
    const isValid = await checkUserIdExists(userId);

    if (isValid) {
      uiState.setIdValid(true);
      uiState.setIdValidMsg('사용가능한 아이디입니다.');
    } else {
      uiState.setIdValid(false);
      uiState.setIdValidMsg('중복된 아이디가 존재합니다. 다시 입력해주세요.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    uiState.setIsLoading(true);
    uiState.setError('');

    if (!uiState.agreeTerms) {
      uiState.setError('약관에 동의해주세요.');
      uiState.setIsLoading(false);
      return;
    }

    try {
      const result = await submitSignup(uiState.formData);

      if (result.success) {
        uiState.setSignUpSuccess(true);
      } else {
        uiState.setError('계정 생성에 실패했습니다. 다시 시도해주세요.');
        uiState.setSignUpSuccess(false);
      }
    } catch (err) {
      uiState.setError('계정 생성에 실패했습니다. 다시 시도해주세요.');
      uiState.setSignUpSuccess(false);
    } finally {
      uiState.setIsLoading(false);
    }
  };

  return (
    <SignupPageView
      formData={uiState.formData}
      agreeTerms={uiState.agreeTerms}
      setAgreeTerms={uiState.setAgreeTerms}
      showPassword={uiState.showPassword}
      showConfirmPassword={uiState.showConfirmPassword}
      isLoading={uiState.isLoading}
      idValid={uiState.idValid}
      idValidMsg={uiState.idValidMsg}
      passwordValid={uiState.passwordValid}
      passwordValidMsg={uiState.passwordValidMsg}
      signUpSuccess={uiState.signUpSuccess}
      isTermAndPolicyModalOpen={uiState.isTermAndPolicyModalOpen}
      setIsTermAndPolicyModalOpen={uiState.setIsTermAndPolicyModalOpen}
      signUpCondition={uiState.signUpCondition}
      onInputChange={uiState.handleInputChange}
      onUserIdKeyUp={uiState.validateUserId}
      onPasswordKeyUp={uiState.validatePassword}
      onConfirmPasswordKeyUp={uiState.validateConfirmPassword}
      onToggleShowPassword={uiState.toggleShowPassword}
      onToggleShowConfirmPassword={uiState.toggleShowConfirmPassword}
      onIdCheck={handleIdCheck}
      onSubmit={handleSubmit}
    />
  );
}
