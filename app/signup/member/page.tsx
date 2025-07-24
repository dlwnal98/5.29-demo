'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Waves, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useCreateUser } from '@/hooks/use-signup';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupMemberPage() {
  const [formData, setFormData] = useState({
    name: '',
    id: 'random',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nonOverlap, setNonOverlap] = useState(false);
  const [overlapMsg, setOverlapMsg] = useState('아이디 중복체크는 필수입니다.');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const router = useRouter();

  const { name, id, email, password, confirmPassword } = formData;

  // 정규식은 나중에 정책 정해서
  // const usernameRegex = /^[a-z][a-z0-9_]{3,15}$/;
  // const passwordRegex = /^(?=\S{8,20}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])/;

  const handleIdCheck = async (tenantId: string, userId: string) => {
    const res = await axios.post(`/api/v1/users/exists?tenantId=${tenantId}&userId=${userId}`);
    console.log(res);
    if (res.data) {
      setNonOverlap(false);
      setOverlapMsg('중복된 아이디가 존재합니다. 다시 입력해주세요.');
    } else {
      setNonOverlap(true);
      setOverlapMsg('');
    }
  };

  //등록 성공하면 유저 아이디 반환
  const { mutate: createUserMutate } = useCreateUser(
    '', // organization 아직 정해진 거 없음
    id, // userId
    password, //password
    name, // name
    email, //email
    {
      onSuccess: (data) => {
        console.log('✅ 유저 생성 성공:', data);
        setSignUpSuccess(true);
        router.push('/');
        // 또는 router.push('/login') 등도 여기서 가능
      },
      onError: (error) => {
        setSignUpSuccess(false);
        console.error('❌ 유저 생성 실패:', error);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 유효성 검사
    // if (usernameRegex.test(formData.id)) {
    //   setError('유효한 아이디입니다.');
    // } else {
    //   setError('아이디 형식이 맞지 않습니다.');
    // }

    // if (passwordRegex.test(formData.password)) {
    //   setError('유효한 비밀번호입니다.');
    // } else {
    //   setError('비밀번호 형식이 맞지 않습니다.');
    // }

    // if (formData.password !== formData.confirmPassword) {
    //   setError('비밀번호가 일치하지 않습니다.');
    //   return;
    // }

    // if (formData.password.length < 8) {
    //   setError('최소 8자 이상 입력해주세요.');
    //   return;
    // }

    // if (!agreeTerms) {
    //   setError('약관에 동의해주세요.');
    //   return;
    // }

    try {
      // 회원가입 API 호출
      createUserMutate();
    } catch (err) {
      setError('계정 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const signUpCondition =
    name.length > 0 &&
    id.length > 0 &&
    nonOverlap &&
    email.length > 0 &&
    password.length > 0 &&
    password === confirmPassword;

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
              onClick={() => (window.location.href = '/')}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
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
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 입력 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                이름
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요."
                required
                className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
              />
            </div>

            {/* 아이디 입력 */}
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                아이디
              </Label>
              <Input
                id="id"
                name="id"
                type="text"
                value={formData.id}
                placeholder="아이디를 입력해주세요."
                disabled
                className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
              />
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
                required
                className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                새로운 비밀번호
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요."
                  required
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pr-12"
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
                  onChange={handleInputChange}
                  placeholder="비밀번호를 다시 입력하세요."
                  required
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer leading-relaxed"
              >
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                  서비스 약관
                </Link>{' '}
                및{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                  개인정보처리방침
                </Link>
                에 동의합니다.
              </Label>
            </div>

            {/* 에러/성공 메시지 */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">{error}</span>
              </div>
            )}

            {/* 회원가입 버튼 */}
            <Button
              type="submit"
              disabled={isLoading || !signUpCondition}
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                '회원가입'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
