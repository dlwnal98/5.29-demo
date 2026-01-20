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
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Resource Delete Confirm
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            <div className="space-y-2">
              <p className="font-semibold">⚠️ Warning: This action cannot be undone!</p>
              <p>
                Resource{' '}
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {resourcePath}
                </span>
                will be permanently deleted.
              </p>
              <p className="text-sm text-red-600">
                • All methods associated with this resource will be deleted.
                <br />• API calls may fail.
                <br />• This action will be applied immediately and cannot be undone.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteResource}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white">
            {isPending ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
