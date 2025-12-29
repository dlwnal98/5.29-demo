import type React from 'react';
import { useMemberSignupData } from './hooks/useMemberSignupData';
import { useMemberSignupUIState } from './hooks/useMemberSignupUIState';
import MemberSignupPageView from './MemberSignupPageView';

export default function SignupMemberPage() {
  const uiState = useMemberSignupUIState();
  const { submitSignup } = useMemberSignupData();

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
      const success = await submitSignup(uiState.formData);

      if (success) {
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
    <MemberSignupPageView
      formData={uiState.formData}
      agreeTerms={uiState.agreeTerms}
      setAgreeTerms={uiState.setAgreeTerms}
      showPassword={uiState.showPassword}
      showConfirmPassword={uiState.showConfirmPassword}
      isLoading={uiState.isLoading}
      signUpSuccess={uiState.signUpSuccess}
      passwordValid={uiState.passwordValid}
      passwordValidMsg={uiState.passwordValidMsg}
      isTermAndPolicyModalOpen={uiState.isTermAndPolicyModalOpen}
      setIsTermAndPolicyModalOpen={uiState.setIsTermAndPolicyModalOpen}
      signUpCondition={uiState.signUpCondition}
      onInputChange={uiState.handleInputChange}
      onPasswordKeyUp={uiState.validatePassword}
      onConfirmPasswordKeyUp={uiState.validateConfirmPassword}
      onToggleShowPassword={uiState.toggleShowPassword}
      onToggleShowConfirmPassword={uiState.toggleShowConfirmPassword}
      onSubmit={handleSubmit}
    />
  );
}
