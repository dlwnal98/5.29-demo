import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedResource: { path: string };
  handleDeleteResource: () => void;
}

export function DeleteResourceDialog({
  open,
  onOpenChange,
  selectedResource,
  handleDeleteResource,
}: DeleteResourceDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            리소스 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            <div className="space-y-2">
              <p className="font-semibold">⚠️ 경고: 이 작업은 되돌릴 수 없습니다!</p>
              <p>
                리소스{' '}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {selectedResource.path}
                </span>
                을(를) 삭제하시겠습니까?
              </p>
              <p className="text-sm text-red-600">
                • 이 리소스와 연결된 모든 메서드가 삭제됩니다
                <br />• API 호출이 실패할 수 있습니다
                <br />• 이 작업은 즉시 적용되며 복구할 수 없습니다
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteResource}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            삭제하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
