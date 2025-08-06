'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Waves, User, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { userIdRegex, passwordRegex } from '@/lib/etc';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [idValid, setIdValid] = useState(false);
  const [idValidMsg, setIdValidMsg] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidMsg, setPasswordValidMsg] = useState('');

  // const router = useRouter();

  // 아이디 저장
  // const handleSaveId = (checked: boolean) => {
  //   setRememberMe(checked);

  //   if (checked) {
  //     localStorage.setItem('userId', userId);
  //   } else {
  //     localStorage.removeItem('userId');
  //   }
  // };

  const validateUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    if (userIdRegex.test(e.target.value)) {
      setIdValid(true);
      setIdValidMsg('유효한 아이디입니다.');
    } else {
      setIdValid(false);
      setIdValidMsg('아이디 형식이 맞지 않습니다.');
    }
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

  // 로그인 API
  const handleLogin = async () => {
    setIsLoading(true); // 요청 시작할 때 로딩 활성화

    try {
      const res = await axios.post('/api/v1/code', {
        userId: userId,
        userPassword: password,
        redirectUri: `/auth-callback`,
      });

      console.log(res);

      if (res?.data?.success === undefined) {
        localStorage.setItem('userId', userId);

        window.location.href = res.request.responseURL;
      } else if (!res?.data?.success) {
        setError(res?.data?.message);
      }
    } catch (e) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 요청 끝나면 로딩 비활성화 (성공/실패와 무관하게)
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-[8px_8px_24px_rgba(0,0,0,0.1)] border-0 rounded-2xl">
        <CardHeader className="space-y-6 pb-6">
          {/* 회사 로고 */}
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Waves className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* 제목 */}
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Login to Clalink APIM
            </CardTitle>
            {/* <CardDescription className="text-gray-600">
              Welcome back! Please sign in to your account
            </CardDescription> */}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID 입력 */}
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
                ID
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.replace(/\s+/g, ''))}
                  onKeyUp={(e) => validateUserId(e)}
                  placeholder="아이디를 입력해주세요."
                  required
                  className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pl-10"
                />
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

            {/* PW 입력 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\s+/g, ''))}
                  onKeyUp={(e) => validatePassword(e)}
                  placeholder="비밀번호를 입력해주세요."
                  required
                  className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pl-10 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* 아이디 저장 & 비밀번호 찾기 */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => handleSaveId(checked as boolean)}
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                  아이디 저장
                </Label>
              </div>

              비밀번호 찾기 나중에
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                비밀번호를 잊었나요?
              </Link>
            </div> */}
            {/* 에러/성공 메시지 */}
            {passwordValidMsg && (
              <>
                {passwordValid ? (
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
            )}

            {/* Login 버튼 */}
            <Button
              type="submit"
              disabled={isLoading || !idValid || !passwordValid}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                '로그인'
              )}
            </Button>

            {/* 회원가입 링크 */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?
                <Link
                  href="/signup"
                  className="ml-[5px] text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  가입하세요!
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
