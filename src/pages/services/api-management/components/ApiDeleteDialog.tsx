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
import { useDeleteAPI } from '@/hooks/use-apimanagement';
import { toast } from 'sonner';

interface DeleteMethodDialogProps {
    selectedAPIId: string;
    userKey: string;
    open: boolean;
    apiName: string;
    onOpenChange: (open: boolean) => void;
}

export default function ApiDeleteDialog({
    selectedAPIId,
    open,
    onOpenChange,
    userKey,
    apiName,
}: DeleteMethodDialogProps) {
    const { mutate: deleteAPI } = useDeleteAPI({
        onSuccess: () => {
            toast.success('API has been deleted.');
            onOpenChange(false);
        },
        onError: (error: unknown) => {
            const axiosError = error as { response?: { data?: { message?: string } } }; const serverMessage = axiosError?.response?.data?.message ?? 'Failed to delete API.';
            toast.error(serverMessage);
        },
    });

    const handleDeleteApi = () => {
        if (userKey) {
            deleteAPI({ apiId: selectedAPIId, userKey: userKey });
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Confirm API Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                        <div className="space-y-3">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
                                    🚨 Warning: This action cannot be undone!
                                </p>
                                <p className="text-red-700 dark:text-red-300 text-sm">
                                    <strong>{apiName}</strong> API will be permanently deleted.
                                </p>
                            </div>
                            <div className="text-sm text-red-600 space-y-1">
                                <p>
                                    ⚠️ <strong>Issues that occur on deletion:</strong>
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>
                                        All API calls using this method will <strong>fail immediately</strong>
                                    </li>
                                    <li>All connected integration settings and response mappings will be deleted</li>
                                    <li>This method will be completely removed on API deployment</li>
                                    <li>Client applications may receive 404 errors</li>
                                </ul>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            onOpenChange(false);
                        }}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteApi}
                        className="bg-red-600 hover:bg-red-700 text-white">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
