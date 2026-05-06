import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Waves, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SignupFormData } from './hooks/useSignupUIState';

export interface SignupPageViewProps {
  // Form Data
  formData: SignupFormData;

  // Terms
  agreeTerms: boolean;
  setAgreeTerms: React.Dispatch<React.SetStateAction<boolean>>;

  // Password Visibility
  showPassword: boolean;
  showConfirmPassword: boolean;

  // Loading
  isLoading: boolean;

  // ID Validation
  idValid: boolean;
  idValidMsg: string;

  // Password Validation
  passwordValid: boolean;
  passwordValidMsg: string;

  // Signup Success
  signUpSuccess: boolean;

  // Policy Modal
  isTermAndPolicyModalOpen: boolean;
  setIsTermAndPolicyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Computed
  signUpCondition: boolean;

  // Handlers
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserIdKeyUp: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordKeyUp: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
  onIdCheck: (userId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignupPageView(props: SignupPageViewProps) {
  const {
    formData,
    agreeTerms,
    setAgreeTerms,
    showPassword,
    showConfirmPassword,
    isLoading,
    idValid,
    idValidMsg,
    passwordValid,
    passwordValidMsg,
    signUpSuccess,
    isTermAndPolicyModalOpen,
    setIsTermAndPolicyModalOpen,
    signUpCondition,
    onInputChange,
    onUserIdKeyUp,
    onPasswordKeyUp,
    onConfirmPasswordKeyUp,
    onToggleShowPassword,
    onToggleShowConfirmPassword,
    onIdCheck,
    onSubmit,
  } = props;

  const { password, confirmPassword } = formData;

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
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
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
                onChange={onInputChange}
                placeholder="이름을 입력해주세요."
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
                onChange={onInputChange}
                placeholder="이름을 입력해주세요."
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
                  onChange={onInputChange}
                  onKeyUp={(e) => onUserIdKeyUp(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                  placeholder="아이디 4자 이상을 입력해주세요."
                  className="col-span-2 h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                />
                <Button
                  type="button"
                  className="h-10"
                  onClick={() => onIdCheck(formData.userId)}
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
                onChange={onInputChange}
                placeholder="이메일를 입력해주세요."
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
                  onChange={onInputChange}
                  onKeyUp={(e) => onPasswordKeyUp(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                  placeholder="비밀번호 4자 이상 입력하세요"
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={onToggleShowPassword}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {/* 비밀번호 확인 */}
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  disabled={!passwordValid}
                  onChange={onInputChange}
                  onKeyUp={onConfirmPasswordKeyUp}
                  placeholder="비밀번호를 다시 입력하세요."
                  className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={onToggleShowConfirmPassword}>
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

            {/* 약관 동의 */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
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
                  to="/"
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
