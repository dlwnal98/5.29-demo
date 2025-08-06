'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Shield,
  Save,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import {
  changePassword,
  modifyUserInfo,
  deleteUser,
  getReJWTToken,
} from '@/hooks/use-settings-account';
import { useAuthStore } from '@/store/store';
import { passwordRegex } from '@/lib/etc';

function AccountDeletedModal() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = '/';
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
          계정이 성공적으로 삭제되었습니다.
        </h4>
        <p className="text-sm text-red-700 dark:text-red-400 space-y-1">
          이용해주셔서 감사합니다. 로그인 화면으로 이동합니다...
        </p>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const userData = useAuthStore((state) => state.user);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidMsg, setPasswordValidMsg] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [showCompleteDeleted, setShowCompleteDeleted] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const validatePassword = () => {
    if (!currentPw) {
      toast.error('현재 비밀번호를 입력해주세요.');
      return false;
    }
    if (newPw.length < 8) {
      toast.error('새 비밀번호는 8자 이상이어야 합니다.');
      return false;
    }
    if (!passwordRegex.test(newPw)) {
      toast.error('비밀번호 형식이 맞지 않습니다.');
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }
    if (newPw !== confirmNewPw) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await deleteUser(userData?.userKey);

      localStorage.clear();
      // toast.success('계정이 삭제되었습니다.');
      // window.location.replace('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setShowCompleteDeleted(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleModifyUser = async () => {
    const name = userName ? userName : userData?.name;
    const email = userEmail ? userEmail : userData?.email;

    try {
      const res = await modifyUserInfo(userData?.userKey, name, email);

      // if (res) {
      toast.success('유저정보가 수정되었습니다.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      getReJWTToken();

      // 새로고침 시키는 거는 액세스 토큰이 교체되었을 때
      // 사이드바에서 useEffect로 정보가 바뀌지 않으면 하는걸로
      // window.location.reload();
      // }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    try {
      const res = await changePassword(userData?.userKey, currentPw, newPw);

      if (res) {
        if (res.success === false) {
          toast.error(res.message);
        }
      } else {
        toast.success('비밀번호가 성공적으로 변경되었습니다');
        setCurrentPw('');
        setNewPw('');
        setConfirmNewPw('');
        setPasswordValid(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      console.error('실패!', e);
    }
  };

  console.log(newPw, confirmNewPw, passwordValid);

  return (
    <AppLayout>
      <Toaster position="bottom-center" richColors expand={true} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  계정 설정
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  개인 정보 및 보안 설정을 관리합니다
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Profile Information */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      프로필 정보
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      기본 프로필 정보를 수정할 수 있습니다
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20 ring-4 ring-blue-100 dark:ring-blue-900/50">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-semibold">
                      {userData?.name?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {userData?.name}
                    </h3>
                    <p className=" text-sm text-gray-600 dark:text-gray-400">{userData?.email}</p>
                    <Badge
                      variant="outline"
                      className="!mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800"
                    >
                      {userData?.organizationId}
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="userId"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      사용자 ID
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="userId"
                        value={userData?.userId}
                        disabled={true}
                        className="pl-10 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      이름
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={userName ? userName : userData?.name}
                        onChange={(e) => setUserName(e.target.value)}
                        className="pl-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800"
                        placeholder="이름을 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      이메일
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={userEmail ? userEmail : userData?.email}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="pl-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800"
                        placeholder="이메일을 입력하세요"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleModifyUser}
                    disabled={isProfileSaving}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6"
                  >
                    {isProfileSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        저장 중...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        변경사항 저장
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      계정 보안
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      비밀번호를 변경하여 계정을 안전하게 보호하세요
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      현재 비밀번호
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        className="pr-10 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800"
                        placeholder="현재 비밀번호를 입력하세요"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      새 비밀번호
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        className="pr-10 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800"
                        placeholder="새 비밀번호를 입력하세요"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      새 비밀번호 확인
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={confirmNewPw}
                        onChange={(e) => setConfirmNewPw(e.target.value)}
                        className="pr-10 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800"
                        placeholder="새 비밀번호를 다시 입력하세요"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {confirmNewPw && (
                      <div className="flex items-center space-x-2 mt-1">
                        {newPw === confirmNewPw ? (
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            <span className="text-xs">비밀번호가 일치합니다</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                            <XCircle className="h-3 w-3" />
                            <span className="text-xs">비밀번호가 일치하지 않습니다</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleChangePassword}
                    disabled={passwordValid || confirmNewPw !== newPw}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6"
                  >
                    {isPasswordSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        변경 중...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        비밀번호 변경
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-l-4 border-l-red-500">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-red-600 dark:text-red-400">
                      위험 구역
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      이 작업들은 되돌릴 수 없습니다. 신중하게 진행해주세요.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-red-800 dark:text-red-300">계정 삭제</h4>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        계정을 영구적으로 삭제합니다. 모든 데이터가 복구 불가능하게 삭제됩니다.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      계정 삭제
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-xl text-red-600 dark:text-red-400">
                  계정 삭제 확인
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  이 작업은 되돌릴 수 없습니다.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {showCompleteDeleted ? (
            <AccountDeletedModal />
          ) : (
            <>
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                    ⚠️ 다음 데이터가 영구적으로 삭제됩니다:
                  </h4>
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1 ml-4">
                    <li>• 모든 개인 정보 및 프로필 데이터</li>
                    <li>• 생성한 모든 프로젝트 및 설정</li>
                    <li>• 업로드한 모든 파일 및 문서</li>
                    <li>• 계정 기록 및 활동 로그</li>
                  </ul>
                </div>
              </div>
              <DialogFooter className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                  }}
                  className="border-gray-300 dark:border-gray-600"
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  계정 삭제
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
