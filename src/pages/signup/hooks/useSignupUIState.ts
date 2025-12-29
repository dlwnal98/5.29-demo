import type React from 'react';
import { useState } from 'react';
import { userIdRegex, passwordRegex } from '@/lib/etc';

export interface SignupFormData {
  organizationName: string;
  fullName: string;
  userId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UseSignupUIStateReturn {
  // Form Data
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;

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

  // ID Validation
  idValid: boolean;
  setIdValid: React.Dispatch<React.SetStateAction<boolean>>;
  idValidMsg: string;
  setIdValidMsg: React.Dispatch<React.SetStateAction<string>>;

  // Password Validation
  passwordValid: boolean;
  setPasswordValid: React.Dispatch<React.SetStateAction<boolean>>;
  passwordValidMsg: string;
  setPasswordValidMsg: React.Dispatch<React.SetStateAction<string>>;

  // Overlap Check (unused but kept for compatibility)
  nonOverlap: boolean;
  setNonOverlap: React.Dispatch<React.SetStateAction<boolean>>;
  overlapMsg: string;
  setOverlapMsg: React.Dispatch<React.SetStateAction<string>>;

  // Signup Success
  signUpSuccess: boolean;
  setSignUpSuccess: React.Dispatch<React.SetStateAction<boolean>>;

  // Policy Modal
  isTermAndPolicyModalOpen: boolean;
  setIsTermAndPolicyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Computed
  signUpCondition: boolean;

  // Handlers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateUserId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validatePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateConfirmPassword: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
}

export function useSignupUIState(): UseSignupUIStateReturn {
  const [formData, setFormData] = useState<SignupFormData>({
    organizationName: '',
    fullName: '',
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [idValid, setIdValid] = useState(false);
  const [idValidMsg, setIdValidMsg] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidMsg, setPasswordValidMsg] = useState('');
  const [nonOverlap, setNonOverlap] = useState(false);
  const [overlapMsg, setOverlapMsg] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [isTermAndPolicyModalOpen, setIsTermAndPolicyModalOpen] = useState(false);

  const { fullName, email, password, confirmPassword } = formData;

  const signUpCondition =
    fullName.length > 0 &&
    idValid &&
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

  const validateUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userIdRegex.test(e.target.value)) {
      setIdValid(true);
      setIdValidMsg('유효한 아이디입니다. 중복확인을 해주세요.');
    } else {
      setIdValid(false);
      setIdValidMsg('아이디 형식이 맞지 않습니다.');
    }
  };

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 4) {
      setPasswordValid(false);
      setPasswordValidMsg('최소 4자 이상 입력해주세요.');
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
      setPasswordValidMsg('');
    } else {
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
    idValid,
    setIdValid,
    idValidMsg,
    setIdValidMsg,
    passwordValid,
    setPasswordValid,
    passwordValidMsg,
    setPasswordValidMsg,
    nonOverlap,
    setNonOverlap,
    overlapMsg,
    setOverlapMsg,
    signUpSuccess,
    setSignUpSuccess,
    isTermAndPolicyModalOpen,
    setIsTermAndPolicyModalOpen,
    signUpCondition,
    handleInputChange,
    validateUserId,
    validatePassword,
    validateConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
  };
}
