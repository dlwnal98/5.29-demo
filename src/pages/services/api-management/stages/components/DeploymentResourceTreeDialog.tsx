'use client';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
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
    const { resourceTree } = useDeploymentResourceTree(selectedDeploymentId);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-blue-600">배포 상세 설명</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            배포된 리소스 목록을 보여줍니다.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[600px] overflow-y-auto">
                        {resourceTree[0] && <DeploymentResourceTreeItem resource={resourceTree[0]} />}
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
        </>
    );
}
