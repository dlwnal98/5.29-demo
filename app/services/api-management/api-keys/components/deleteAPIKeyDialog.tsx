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
import { ApiKey } from '@/hooks/use-apiKeys';

interface deleteAPIKeyProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmDeleteApiKey: any;
  deletingApiKey: ApiKey | null;
}

export default function DeleteAPIKeyDialog({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  confirmDeleteApiKey,
  deletingApiKey,
}: deleteAPIKeyProps) {
  return (
    <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            API Key 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            {deletingApiKey && (
              <>
                <div className="text-gray-700 dark:text-gray-300">
                  <strong className="text-red-600">경고:</strong> 이 작업은 되돌릴 수 없습니다.
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  API Key <strong className="text-red-600">"{deletingApiKey.name}"</strong>이
                  영구적으로 삭제됩니다.
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  삭제된 API Key를 사용하는 모든 애플리케이션과 서비스는 즉시 액세스가 차단됩니다.
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                  <div className="text-sm text-red-800 dark:text-red-200 font-medium">
                    삭제될 API Key Id:
                  </div>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <div className="flex items-center gap-2">
                      <span>•</span>
                      <span className="font-mono font-bold">{deletingApiKey.keyId}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => confirmDeleteApiKey(deletingApiKey?.keyId)}
            className="bg-red-600 hover:bg-red-700 text-white">
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
