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
    stageDetailData: any;
    // 훅의 handleDeleteStage가 인자를 받지 않으므로 아래와 같이 수정
    deleteStage: () => void;
}

export default function DeleteStageDialog({
    open,
    onOpenChange,
    stageDetailData,
    deleteStage,
}: DeleteStageDialogProps) {

    return (
        <>
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600 text-xl">
                            Stage 삭제
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                            <div className="space-y-2">
                                <p className="font-semibold">⚠️ 경고: 이 작업은 되돌릴 수 없습니다!</p>
                                <p>
                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        {stageDetailData?.stageName}
                                    </span>
                                    를 삭제하시겠습니까?
                                </p>
                                <div className="text-sm text-red-600 font-medium">
                                    <p>• 이 스테이지의 모든 배포가 중단됩니다.</p>
                                    <p>• API 호출이 실패할 수 있습니다.</p>
                                    <p>• 이 작업은 실행 후 취소할 수 없습니다.</p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteStage}
                            className="bg-red-600 hover:bg-red-700 text-white">
                            삭제
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
