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
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm API Key Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            {deletingApiKey && (
              <>
                <div className="text-gray-700 dark:text-gray-300">
                  <strong className="text-red-600">Warning:</strong> This action cannot be undone.
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  API Key <strong className="text-red-600">"{deletingApiKey.keyName}"</strong>
                  {" "}will be permanently deleted.
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  All applications and services using this API Key will immediately lose access.
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                  <div className="text-sm text-red-800 dark:text-red-200 font-medium">
                    API Key ID to be deleted:
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deletingApiKey && onConfirm(deletingApiKey.apiKeyId)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
