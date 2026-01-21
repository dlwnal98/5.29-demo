import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDeploymentResourceTree } from '../hooks/useDeploymentResourceTree';
import { DeploymentResourceTreeItem } from './DeploymentResourceTreeItem';

interface DeploymentResourceTreeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDeploymentId: string;
}

export default function DeploymentResourceTreeDialog({
    open,
    onOpenChange,
    selectedDeploymentId,
}: DeploymentResourceTreeDialogProps) {
    const { resourceTree, isLoading, isReady } = useDeploymentResourceTree(selectedDeploymentId, open);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-600">배포 리소스 상세</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        배포 한 시점의 리소스 목록을 보여줍니다.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[600px] overflow-y-auto min-h-[100px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                            <span className="ml-2 text-sm text-gray-500">배포 리소스 트리 로딩 중...</span>
                        </div>
                    ) : isReady && resourceTree[0] ? (
                        <DeploymentResourceTreeItem resource={resourceTree[0]} />
                    ) : (
                        <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                            배포 리소스를 찾을 수 없습니다.
                        </div>
                    )}
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="default"
                        onClick={() => {
                            onOpenChange(false);
                        }}>
                        확인
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
