'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { toast, Toaster } from 'sonner';
import { useActivatePreviousDeployment } from '@/hooks/use-stages';
interface ActiveDeploymentChangeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  userKey: string;
  apiId: string;
  selectedStage: any;
  currentActiveDeployment: any;
  selectedDeploymentData: any;
  setSelectedDeployment: (value: string | null) => void; // <-- 수정
  selectedDeployment: string | null;
}

export default function ActiveDeploymentChangeDialog({
  open,
  onOpenChange,
  userKey,
  selectedStage,
  currentActiveDeployment,
  selectedDeploymentData,
  setSelectedDeployment,
  selectedDeployment,
}: ActiveDeploymentChangeProps) {
  const { mutate: changeDeployment } = useActivatePreviousDeployment({
    onSuccess: () => {
      toast.success('배포가 성공적으로 변경되었습니다.');
      onOpenChange(false);
      setSelectedDeployment(null);
    },
    onError: () => {
      toast.error('배포 변경에 실패하였습니다.');
    },
  });
  const confirmActiveDeploymentChange = () => {
    if (selectedStage.stageId && selectedDeployment) {
      changeDeployment({
        stageId: selectedStage.stageId,
        targetDeploymentId: selectedDeployment,
        activatedBy: userKey || '',
      });
    }
  };
  return (
    <>
      <Toaster expand={true} richColors position="bottom-center" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                활성 배포 변경
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              '{selectedStage.name}' 스테이지의 활성 배포를 업데이트하시겠습니까?
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  현재 활성 배포
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currentActiveDeployment?.deploymentId} - {currentActiveDeployment?.date}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  새 활성 배포
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedDeploymentData?.deploymentId} - {selectedDeploymentData?.date}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              현재 활성 배포가 즉시 새 배포로 교체됩니다.
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              onClick={confirmActiveDeploymentChange}
              className="bg-orange-500 hover:bg-orange-600 text-white">
              활성 배포 변경
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
