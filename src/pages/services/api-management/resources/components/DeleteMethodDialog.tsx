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
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Method Delete Confirm
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  🚨 Warning: This action cannot be undone!
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Method{' '}
                  <strong>
                    {methodToDelete?.type} {methodToDelete?.resourcePath}
                  </strong>
                  will be permanently deleted.
                </p>
              </div>
              <div className="text-sm text-red-600 space-y-1">
                <p>
                  ⚠️ <strong>Problems that occur when deleting:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    All API calls using this method will <strong>fail immediately</strong>
                  </li>
                  <li>Both the connected integration settings and response mappings will be deleted.</li>
                  <li>This method will be completely removed when the API is deployed.</li>
                  <li>Client applications may encounter 404 errors.</li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteMethod}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white">
            {isPending ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
