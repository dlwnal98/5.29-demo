'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Waves, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { createUser } from '@/hooks/use-signup';
import axios from 'axios';
import { userIdRegex, passwordRegex } from '@/lib/etc';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { requestGet } from '@/lib/apiClient';
export default function SignupPage() {
  const [formData, setFormData] = useState({
    organizationName: '', // 아직 정해진 거 없음
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.replace(/\s+/g, ''), //모든 공백 제거
    });
  };

  const { fullName, userId, email, password, confirmPassword, organizationName } = formData;

  const handleIdCheck = async (userId: string) => {
    const res = await requestGet(`/api/v1/users/exists?userId=${userId}`);

    if (res.data === false) {
      setIdValid(true);
      setIdValidMsg('사용가능한 아이디입니다.');
    } else {
      setIdValid(false);
      setIdValidMsg('중복된 아이디가 존재합니다. 다시 입력해주세요.');
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 유효성 검사

    if (!agreeTerms) {
      setError('약관에 동의해주세요.');
      return;
    }

    try {
      // 회원가입 API 호출
      const res = await createUser(
        organizationName, // organization 아직 정해진 거 없음
        userId, // userId
        password, //password
        fullName, // name
        email //email
      );

      // console.log(res);

      if (res.code == 200) {
        setSignUpSuccess(true);
      } else {
        setError('계정 생성에 실패했습니다. 다시 시도해주세요.');
        setSignUpSuccess(false);
      }
    } catch (err) {
      setError('계정 생성에 실패했습니다. 다시 시도해주세요.');
      setSignUpSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpCondition =
    fullName.length > 0 &&
    idValid &&
    email.length > 0 &&
    passwordValid &&
    password === confirmPassword &&
    agreeTerms;

  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-[8px_8px_24px_rgba(0,0,0,0.1)] border-0 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
            {/* 3D 성공 아이콘 */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              {/* 3D 효과를 위한 그림자 */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-green-200 rounded-full blur-sm opacity-50"></div>
            </div>

            {/* 성공 메시지 */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">회원가입이 완료되었습니다!</h2>
              <p className="text-gray-600">로그인페이지로 이동하여 로그인해주세요</p>
            </div>

            {/* 로그인 페이지로 이동 버튼 */}
            <Button
              type="button"
              onClick={() => (window.location.href = '/')}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
              로그인 페이지로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3">
      <Card className="w-full max-w-md bg-white shadow-[8px_8px_24px_rgba(0,0,0,0.1)] border-0 rounded-2xl">
        <CardHeader className="space-y-4 pb-5">
          {/* 회사 로고 */}
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Waves className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* 제목 */}
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Join Clalink APIM
            </CardTitle>
            {/* <CardDescription className="text-gray-600">
              Create your account to get started
            </CardDescription> */}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 조직 입력 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                조직
              </Label>
              <Input
                id="organizationName"
                name="organizationName"
                type="text"
                value={formData.organizationName}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요."
                // required
                className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
              />
            </div>

            {/* 이름 입력 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                이름
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요."
                // required
                className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
              />
            </div>

            {/* 아이디 입력 */}
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                아이디
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  id="userId"
                  name="userId"
                  type="text"
                  value={formData.userId}
                  onChange={handleInputChange}
                  onKeyUp={(e) => validateUserId(e)}
                  placeholder="아이디 4자 이상을 입력해주세요."
                  // required
                  className="col-span-2 h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                />
                <Button
                  type="button"
                  className="h-10"
                  onClick={() => handleIdCheck(formData.userId)}
                  disabled={!idValid}>
                  중복 확인
                </Button>
              </div>
              {idValidMsg && (
                <>
                  {idValid ? (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs">{idValidMsg}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs">{idValidMsg}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                이메일
              </Label>
              <Input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일를 입력해주세요."
                // required
                className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                비밀번호
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyUp={(e) => validatePassword(e)}
                  placeholder="비밀번호 4자 이상 입력하세요"
                  // required
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {/* 비밀번호 확인 */}
              {/* <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                비밀번호 확인
              </Label> */}
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  disabled={!passwordValid}
                  onChange={handleInputChange}
                  onKeyUp={(e) => {
                    if (formData.password !== e.target.value) {
                      setPasswordValidMsg('');
                    } else {
                      setPasswordValidMsg('비밀번호가 일치합니다.');
                    }
                  }}
                  placeholder="비밀번호를 다시 입력하세요."
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* 에러/성공 메시지 */}
            {passwordValidMsg && (
              <>
                {passwordValid ? (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">{passwordValidMsg}</span>
                  </div>
                ) : (
                  password !== confirmPassword && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs">{passwordValidMsg}</span>
                    </div>
                  )
                )}
              </>
            )}

            {/* {passwordValidMsg && (
              <>
                {passwordValid || password === confirmPassword ? (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">{passwordValidMsg}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">{passwordValidMsg}</span>
                  </div>
                )}
              </>
            )} */}

            {/* 약관 동의 */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                // onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                // onCheckedChange={() => console.log(1)}
                // onChange={() => console.log(2)}
                onClick={() => setIsTermAndPolicyModalOpen(true)}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
              />
              <Label
                htmlFor="terms"
                className="hover:underline text-sm text-gray-600 cursor-pointer leading-relaxed">
                <span className="text-blue-600 hover:text-blue-700">서비스 약관</span> 및{' '}
                <span className="text-blue-600 hover:text-blue-700">개인정보처리방침</span>에
                동의합니다.
              </Label>
            </div>

            {/* 회원가입 버튼 */}
            <Button
              type="submit"
              disabled={isLoading || !signUpCondition}
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                '회원가입'
              )}
            </Button>

            {/* 로그인 링크 */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?
                <Link
                  href="/"
                  className="ml-[5px] text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  로그인하세요!
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      <Dialog open={isTermAndPolicyModalOpen} onOpenChange={setIsTermAndPolicyModalOpen}>
        <DialogContent className="sm:max-w-[500px] sm:max-h-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center  mb-2">
              서비스 약관 및 개인정보처리방침
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <div className="bg-blue-50 border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-800 mb-2">
                  서비스 약관 및 개인정보 처리 방침
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-bold underline">{}</span> 사용자가 조직에서 삭제됩니다.
                  <br />• 조직 관련한 사용자의 모든 권한이 제거됩니다
                  <br />• 관련된 모든 활동 기록이 삭제됩니다
                  <br />
                  <br />
                  <span className="font-semibold">정말로 이 멤버를 삭제하시겠습니까?</span>
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex !justify-center space-x-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setIsTermAndPolicyModalOpen(false);
                setAgreeTerms(false);
              }}>
              취소
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                setIsTermAndPolicyModalOpen(false);
                setAgreeTerms(true);
              }}>
              동의
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
