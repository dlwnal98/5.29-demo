import type React from 'react';
import { useState } from 'react';
import { passwordRegex } from '@/libs/etc';

export interface MemberSignupFormData {
  name: string;
  id: string | null;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UseMemberSignupUIStateReturn {
  // Form Data
  formData: MemberSignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<MemberSignupFormData>>;

  // Terms
  agreeTerms: boolean;
  setAgreeTerms: React.Dispatch<React.SetStateAction<boolean>>;

  // Password Visibility
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;

  // Loading & Error
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;

  // Signup Success
  signUpSuccess: boolean;
  setSignUpSuccess: React.Dispatch<React.SetStateAction<boolean>>;

  // Password Validation
  passwordValid: boolean;
  setPasswordValid: React.Dispatch<React.SetStateAction<boolean>>;
  passwordValidMsg: string;
  setPasswordValidMsg: React.Dispatch<React.SetStateAction<string>>;

  // Policy Modal
  isTermAndPolicyModalOpen: boolean;
  setIsTermAndPolicyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Computed
  signUpCondition: boolean;

  // Handlers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validatePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateConfirmPassword: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
}

export function useMemberSignupUIState(): UseMemberSignupUIStateReturn {
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;

  const [formData, setFormData] = useState<MemberSignupFormData>({
    name: '',
    id: userId,
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidMsg, setPasswordValidMsg] = useState('');
  const [isTermAndPolicyModalOpen, setIsTermAndPolicyModalOpen] = useState(false);

  const { name, id, email, password, confirmPassword } = formData;

  const signUpCondition =
    name.length > 0 &&
    (id?.length ?? 0) > 0 &&
    email.length > 0 &&
    passwordValid &&
    password === confirmPassword &&
    agreeTerms;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.replace(/\s+/g, ''),
    });
  };

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 8) {
      setPasswordValid(false);
      setPasswordValidMsg('최소 8자 이상 입력해주세요.');
      return;
    }

    if (passwordRegex.test(e.target.value)) {
      setPasswordValid(true);
      setPasswordValidMsg('유효한 비밀번호입니다.');
    } else {
      setPasswordValid(false);
      setPasswordValidMsg('비밀번호 형식이 맞지 않습니다.');
    }
  };

  const validateConfirmPassword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (formData.password !== target.value) {
      setPasswordValid(false);
      setPasswordValidMsg('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordValid(true);
      setPasswordValidMsg('비밀번호가 일치합니다.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    formData,
    setFormData,
    agreeTerms,
    setAgreeTerms,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    setIsLoading,
    error,
    setError,
    signUpSuccess,
    setSignUpSuccess,
    passwordValid,
    setPasswordValid,
    passwordValidMsg,
    setPasswordValidMsg,
    isTermAndPolicyModalOpen,
    setIsTermAndPolicyModalOpen,
    signUpCondition,
    handleInputChange,
    validatePassword,
    validateConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
  };
}
