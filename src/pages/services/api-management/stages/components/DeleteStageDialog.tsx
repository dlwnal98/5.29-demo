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
                            스테이지 삭제 확인
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                            <div className="space-y-2">
                                <p className="font-semibold">⚠️ 경고: 이 작업은 되돌릴 수 없습니다!</p>
                                <p>
                                    스테이지{' '}
                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        {stageDetailData?.stageName}
                                    </span>
                                    을(를) 삭제하시겠습니까?
                                </p>
                                <p className="text-sm text-red-600">
                                    • 이 스테이지의 모든 배포가 중단됩니다
                                    <br />• API 호출이 실패할 수 있습니다
                                    <br />• 이 작업은 즉시 적용되며 복구할 수 없습니다
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteStage}
                            className="bg-red-600 hover:bg-red-700 text-white">
                            삭제하기
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
