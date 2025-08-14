'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

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
        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">계정이 성공적으로 삭제되었습니다.</h4>
        <p className="text-sm text-red-700 dark:text-red-400 space-y-1">
          이용해주셔서 감사합니다. 로그인 화면으로 이동합니다...
        </p>
      </div>
    </div>
  );
}

interface deleteAccountProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteAccount: any;
  showCompleteDeleted: boolean;
}

export default function DeleteAccountDialog({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteAccount,
  showCompleteDeleted,
}: deleteAccountProps) {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl text-red-600 dark:text-red-400">계정 삭제 확인</DialogTitle>
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
                className="border-gray-300 dark:border-gray-600">
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />
                계정 삭제
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
