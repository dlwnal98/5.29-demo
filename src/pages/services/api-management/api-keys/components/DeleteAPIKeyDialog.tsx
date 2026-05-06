import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { ApiKey } from "@/apis/api-keys.api";

interface DeleteAPIKeyDialogProps {
  isOpen: boolean;
  deletingApiKey: ApiKey | null;
  onClose: () => void;
  onConfirm: (keyId: string) => void;
}

export default function DeleteAPIKeyDialog({
  isOpen,
  deletingApiKey,
  onClose,
  onConfirm,
}: DeleteAPIKeyDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600 text-xl">
            API 키 삭제
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            {deletingApiKey && (
              <>
                <div className="text-gray-700 dark:text-gray-300">
                  <strong className="text-red-600">경고:</strong> 이 작업은 되돌릴 수 없습니다.
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  API Key <strong className="text-red-600">"{deletingApiKey.keyName}"</strong>
                  {" "}가 영구적으로 삭제됩니다.
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  이 API 키를 사용하는 모든 애플리케이션과 서비스는 즉시 접근 권한을 잃게 됩니다.
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                  <div className="text-sm text-red-800 dark:text-red-200 font-medium">
                    삭제할 API 키 ID:
                  </div>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <div className="flex items-center gap-2">
                      <span>•</span>
                      <span className="font-mono font-bold">{deletingApiKey.apiKeyId}</span>
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
            onClick={() => deletingApiKey && onConfirm(deletingApiKey.apiKeyId)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
