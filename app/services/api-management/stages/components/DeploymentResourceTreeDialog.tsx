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
import React from 'react';
import { toast, Toaster } from 'sonner';
import { useGetDeploymentResourceTreeData } from '@/hooks/use-stages';
import { getMethodStyle, resoureceBuildTree } from '@/lib/etc';

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
  console.log(selectedDeploymentId);
  const { data: deploymentResourceTree } = useGetDeploymentResourceTreeData(selectedDeploymentId);

  console.log(deploymentResourceTree);
  const resourceTree = resoureceBuildTree(deploymentResourceTree?.openApiDocument?.paths ?? {});
  console.log(resourceTree);

  const renderDeploymentResourceTree = (resource: any, level = 0) => {
    const hasChildren =
      (resource?.children && resource?.children?.length > 0) ||
      (resource?.methods && resource?.methods?.length > 0);

    return (
      <div key={resource?.id} className="ml-4">
        <div className="flex items-center gap-2 py-1 text-sm">
          <span className="text-gray-900">{resource?.path}</span>
        </div>
        {resource?.methods && resource?.methods?.length > 0 && (
          <div className="ml-4 space-y-1">
            {resource?.methods?.map((method) => (
              <div key={method.id} className="flex items-center gap-2 py-1">
                <span
                  className={` ${getMethodStyle(method.type)} !font-mono !font-bold !text-xs !px-1.5 !py-0.5 rounded`}>
                  {method.type}
                </span>
                {method.info.description && (
                  <span className="text-sm text-gray-600">- {method.info.description}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {resource?.children?.map((child) => renderDeploymentResourceTree(child, level + 1))}
      </div>
    );
  };

  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">배포 상세 설명</DialogTitle>
            <DialogDescription className="text-gray-600">
              배포된 리소스 목록을 보여줍니다.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[600px] overflow-y-auto">
            {renderDeploymentResourceTree(resourceTree[0])}
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
