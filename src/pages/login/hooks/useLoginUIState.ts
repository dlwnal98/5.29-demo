import type React from 'react';
import { useState } from 'react';
import { userIdRegex, passwordRegex } from '@/lib/etc';

export interface UseLoginUIStateReturn {
  // Form Data
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;

  // Password Visibility
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;

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

  // Computed
  canSubmit: boolean;

  // Handlers
  handleUserIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateUserId: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validatePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleShowPassword: () => void;
}

export function useLoginUIState(): UseLoginUIStateReturn {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [idValid, setIdValid] = useState(false);
  const [idValidMsg, setIdValidMsg] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidMsg, setPasswordValidMsg] = useState('');

  const canSubmit = idValid && passwordValid;

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value.replace(/\s+/g, ''));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value.replace(/\s+/g, ''));
  };

  const validateUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userIdRegex.test(e.target.value)) {
      setIdValid(true);
      setIdValidMsg('유효한 아이디입니다.');
    } else {
      setIdValid(false);
      setIdValidMsg('아이디 형식이 맞지 않습니다.');
    }
  };

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 4) {
      setPasswordValid(false);
      setPasswordValidMsg('최소 4자 이상 입력해주세요.');
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    userId,
    setUserId,
    password,
    setPassword,
    showPassword,
    setShowPassword,
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
    canSubmit,
    handleUserIdChange,
    handlePasswordChange,
    validateUserId,
    validatePassword,
    toggleShowPassword,
  };
}
