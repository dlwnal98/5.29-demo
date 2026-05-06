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
  resourcePath: string;
  isPending?: boolean;
  onDeleteResource: () => void;
}

export function DeleteResourceDialog({
  open,
  onOpenChange,
  resourcePath,
  isPending,
  onDeleteResource,
}: DeleteResourceDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 text-xl">
            Resource 삭제
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            <div className="space-y-2">
              <p className="font-semibold">⚠️ 경고: 이 작업은 되돌릴 수 없습니다!</p>
              <p>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {resourcePath}
                </span>
                이(가) 영구적으로 삭제됩니다.
              </p>
              <p className="text-sm text-red-600 font-medium">
                • 이 Resource와 연결된 모든 메서드가 삭제됩니다.
                <br />• API 호출이 실패할 수 있습니다.
                <br />• 이 작업은 즉시 적용되고 되돌릴 수 없습니다.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteResource}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white">
            {isPending ? '삭제중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
