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

interface DeleteMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  methodToDelete: Method | null;
  isPending?: boolean;
  onDeleteMethod: () => void;
}

export function DeleteMethodDialog({
  open,
  onOpenChange,
  methodToDelete,
  isPending,
  onDeleteMethod,
}: DeleteMethodDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 text-xl">
            Method 삭제
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            <div className="space-y-3">
              {/* 주요 경고 박스 */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  🚨 경고: 이 작업은 되돌릴 수 없습니다!
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  메서드{' '}
                  <strong>
                    {methodToDelete?.type} {methodToDelete?.resourcePath}
                  </strong>
                  이(가) 영구적으로 삭제됩니다.
                </p>
              </div>

              {/* 상세 영향도 목록 */}
              <div className="text-sm text-red-600 space-y-1">
                <p>
                  ⚠️ <strong>삭제 시 발생할 수 있는 문제:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    해당 메서드를 호출하는 API 요청은 즉시 실패하게 됩니다.
                  </li>
                  <li>
                    연결된 <strong>통합 설정</strong> 및 <strong>응답 매핑</strong>이 함께 삭제됩니다.
                  </li>
                  <li>
                    API가 배포될 때 해당 메서드가 실제 환경에서 완전히 제거됩니다.
                  </li>
                  <li>
                    클라이언트 애플리케이션에 <strong>404 오류</strong>가 발생할 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteMethod}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white">
            {isPending ? '삭제중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
