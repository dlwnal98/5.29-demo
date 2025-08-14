import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw } from 'lucide-react';

interface ResetMemberProps {
  isResetPasswordModalOpen: boolean;
  setIsResetPasswordModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tempPassword: string;
  userId: string;
  userKey: string;
  handleResetPassword: any;
  handleCopyPassword: any;
}

export default function ResetPasswordDialog({
  isResetPasswordModalOpen,
  setIsResetPasswordModalOpen,
  tempPassword,
  userId,
  userKey,
  handleResetPassword,
  handleCopyPassword,
}: ResetMemberProps) {
  return (
    <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {tempPassword?.length === 0 ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-blue-600 mb-2">
                <RotateCcw className="h-5 w-5 mr-2" />
                임시 비밀번호 발급
              </DialogTitle>

              <DialogDescription className="text-left space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-800 mb-2">
                    임시 비밀번호를 발급하시겠습니까?
                  </p>
                  <p className="text-blue-700 text-sm">
                    <span className="font-bold underline">{userId}</span> 사용자에게 새로운 임시
                    비밀번호가 부여됩니다.
                    <br />
                    사용자는 다음 로그인 시 비밀번호를 변경해야 합니다.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsResetPasswordModalOpen(false)}>
                취소
              </Button>
              <Button
                onClick={() => handleResetPassword(userKey)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                발급
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-blue-600">
                <RotateCcw className="h-5 w-5 mr-2" />
                임시 비밀번호 재발급
              </DialogTitle>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <button
                      className=" w-[100%] flex justify-between items-center hover:underline"
                      onClick={() => handleCopyPassword(tempPassword)}
                    >
                      <span className="block w-[90%] whitespace-normal break-words text-left">
                        {tempPassword}
                      </span>
                      <Copy className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <DialogFooter className="!flex !flex-row !justify-center space-x-2">
              <Button variant="default" onClick={() => setIsResetPasswordModalOpen(false)}>
                확인
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
