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
    open: boolean;
    apiName: string;
    onOpenChange: (open: boolean) => void;
}

export default function ApiDeleteDialog({
    selectedAPIId,
    open,
    onOpenChange,
    apiName,
}: DeleteMethodDialogProps) {
    const { mutate: deleteAPI } = useDeleteAPI({
        onSuccess: () => {
            toast.success('API가 삭제되었습니다.');
            onOpenChange(false);
        },
        onError: (error: unknown) => {
            const axiosError = error as { response?: { data?: { message?: string } } }; const serverMessage = axiosError?.response?.data?.message ?? 'API 삭제 중 오류가 발생했습니다.';
            toast.error(serverMessage);
        },
    });

    const handleDeleteApi = () => {
        deleteAPI({ apiId: selectedAPIId });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
                        API 삭제
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                        <div className="space-y-3">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
                                    🚨 경고: 이 작업은 되돌릴 수 없습니다!
                                </p>
                                <p className="text-red-700 dark:text-red-300 text-sm">
                                    <strong>{apiName}</strong> API가 영구적으로 삭제됩니다.
                                </p>
                            </div>
                            <div className="text-sm text-red-600 space-y-1">
                                <p>
                                    ⚠️ <strong>삭제시 발생하는 문제:</strong>
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>
                                        이 API를 사용하는 모든 API 호출이 즉시 실패합니다.
                                    </li>
                                    <li>연결된 모든 통합 설정과 응답 매핑이 삭제됩니다.</li>
                                    <li>이 메소드는 API 배포 시 완전히 제거됩니다.</li>
                                    <li>클라이언트 애플리케이션에 404 오류가 발생할 수 있습니다.</li>
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
                        취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteApi}
                        className="bg-red-600 hover:bg-red-700 text-white">
                        삭제
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
