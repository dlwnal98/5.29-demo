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
import { ChevronsRight } from 'lucide-react';
interface ActiveDeploymentChangeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  userKey: string;
  apiId: string;
  selectedStage: any;
  currentActiveDeployment: any;
  selectedDeploymentData: any;
  setSelectedDeploymentId: (value: string | null) => void; // <-- 수정
  selectedDeploymentId: string | null;
}

export default function ActiveDeploymentChangeDialog({
  open,
  onOpenChange,
  userKey,
  selectedStage,
  currentActiveDeployment,
  selectedDeploymentData,
  setSelectedDeploymentId,
  selectedDeploymentId,
}: ActiveDeploymentChangeProps) {
  const { mutate: changeDeployment } = useActivatePreviousDeployment({
    onSuccess: () => {
      toast.success('배포가 성공적으로 변경되었습니다.');
      onOpenChange(false);
      setSelectedDeploymentId(null);
    },
    onError: () => {
      toast.error('배포 변경에 실패하였습니다.');
    },
  });
  const confirmActiveDeploymentChange = () => {
    if (selectedStage.stageId && selectedDeploymentId) {
      changeDeployment({
        stageId: selectedStage.stageId,
        targetDeploymentId: selectedDeploymentId,
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
              <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
                활성배포 변경
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 pb-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded mr-1">
                {selectedStage.name}
              </span>
              스테이지의 활성 배포를 업데이트하시겠습니까?
              <div className="text-xs text-red-400 dark:text-red-400 font-medium mt-2">
                * 현재 활성 배포가 즉시 새 배포로 교체됩니다.
              </div>
            </div>

            <div className="flex items-center bg-blue-50 p-5 px-8 rounded">
              <div>
                <div className="text-sm font-bold text-center text-gray-900 dark:text-white mb-1">
                  현재 활성 배포
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {currentActiveDeployment?.deploymentId}
                </div>
              </div>
              <div className="flex items-center space-x-[-13px] mx-auto">
                <ChevronsRight className="text-blue-500 mt-0 w-8 h-8" />
                <ChevronsRight className="text-blue-500 mt-0 w-8 h-8" />
                <ChevronsRight className="text-blue-500 mt-0 w-8 h-8" />
              </div>
              <div>
                <div className="text-sm font-bold text-center text-gray-900 dark:text-white mb-1">
                  새 활성 배포
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {selectedDeploymentData?.deploymentId}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={confirmActiveDeploymentChange} variant={'default'}>
              변경
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
