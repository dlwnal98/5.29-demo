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
// DeleteStageDialog.tsx
interface DeleteStageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userKey: string;
    stageDetailData: any;
    // 훅의 handleDeleteStage가 인자를 받지 않으므로 아래와 같이 수정
    deleteStage: () => void;
}

export default function DeleteStageDialog({
    open,
    onOpenChange,
    userKey,
    stageDetailData,
    deleteStage,
}: DeleteStageDialogProps) {

    return (
        <>
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Delete Stage Confirmation
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                            <div className="space-y-2">
                                <p className="font-semibold">⚠️ Warning: This action cannot be undone!</p>
                                <p>
                                    Stage{' '}
                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        {stageDetailData?.stageName}
                                    </span>
                                    Do you want to delete this stage?
                                </p>
                                <p className="text-sm text-red-600">
                                    • This stage's all deployments will be stopped
                                    <br />• API calls may fail
                                    <br />• This action cannot be undone
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteStage}
                            className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
