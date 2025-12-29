import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff, Waves, User, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Toaster } from 'sonner';

export interface LoginPageViewProps {
  // Form Data
  userId: string;
  password: string;

  // Password Visibility
  showPassword: boolean;

  // Loading
  isLoading: boolean;

  // ID Validation
  idValid: boolean;
  idValidMsg: string;

  // Password Validation
  passwordValid: boolean;
  passwordValidMsg: string;

  // Computed
  canSubmit: boolean;

  // Handlers
  onUserIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserIdKeyUp: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordKeyUp: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShowPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginPageView(props: LoginPageViewProps) {
  const {
    userId,
    password,
    showPassword,
    isLoading,
    idValid,
    idValidMsg,
    passwordValid,
    passwordValidMsg,
    canSubmit,
    onUserIdChange,
    onPasswordChange,
    onUserIdKeyUp,
    onPasswordKeyUp,
    onToggleShowPassword,
    onSubmit,
  } = props;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Toaster position="bottom-center" richColors expand={true} />

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
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
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
                  onChange={onUserIdChange}
                  onKeyUp={(e) => onUserIdKeyUp(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                  placeholder="아이디를 입력해주세요."
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
                  onChange={onPasswordChange}
                  onKeyUp={(e) => onPasswordKeyUp(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                  placeholder="비밀번호 4자 이상 입력하세요"
                  className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg pl-10 pr-12"
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
              disabled={isLoading || !canSubmit}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
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
                  to="/signup"
                  className="ml-[5px] text-blue-600 hover:text-blue-700 font-medium hover:underline">
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
