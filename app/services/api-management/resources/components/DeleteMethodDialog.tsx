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
import type { Method } from '@/types/resource';
import { deleteMethod } from '@/hooks/use-methods';
import { toast, Toaster } from 'sonner';

interface DeleteMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  methodToDelete: Method | null;
}

export function DeleteMethodDialog({
  open,
  onOpenChange,
  methodToDelete,
}: DeleteMethodDialogProps) {
  console.log(methodToDelete);

  const handleDeleteMethod = async () => {
    if (methodToDelete) {
      const res = await deleteMethod(methodToDelete?.apiKeys?.methodId);

      if (res.code == 200) {
        toast.success(
          `메서드 '${methodToDelete.type} ${methodToDelete.resourcePath}'이(가) 삭제되었습니다.`
        );
        onOpenChange(false);
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            메서드 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-800 mb-2">
                  🚨 위험: 이 작업은 되돌릴 수 없습니다!
                </p>
                <p className="text-red-700 text-sm">
                  메서드{' '}
                  <strong>
                    {methodToDelete?.type} {methodToDelete?.resourcePath}
                  </strong>
                  를 영구적으로 삭제합니다.
                </p>
              </div>
              <div className="text-sm text-red-600 space-y-1">
                <p>
                  ⚠️ <strong>삭제 시 발생하는 문제:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    이 메서드를 사용하는 모든 API 호출이 <strong>즉시 실패</strong>합니다
                  </li>
                  <li>연결된 통합 설정과 응답 매핑이 모두 삭제됩니다</li>
                  <li>API 배포 시 이 메서드가 완전히 제거됩니다</li>
                  <li>클라이언트 애플리케이션에서 404 오류가 발생할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteMethod}
            className="bg-red-600 hover:bg-red-700 text-white">
            삭제하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
