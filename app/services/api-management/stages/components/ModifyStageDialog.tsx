'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast, Toaster } from 'sonner';
import { useModifyStage } from '@/hooks/use-stages';

interface ModifyStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStage: {
    name: string;
    description: string;
    stageId: string;
  };
}

export default function ModifyStageDialog({
  open,
  onOpenChange,
  selectedStage,
}: ModifyStageDialogProps) {
  const [editForm, setEditForm] = useState({
    name: selectedStage.name,
    description: selectedStage.description,
    apiCacheEnabled: false,
    methodLevelCacheEnabled: false,
    throttlingEnabled: false,
    wafProfile: '없음',
    clientCertificate: '없음',
  });

  useEffect(() => {
    if (selectedStage)
      setEditForm({
        ...editForm,
        name: selectedStage.name,
        description: selectedStage.description,
      });
  }, [selectedStage]);

  const { mutate: modifyStage } = useModifyStage({
    onSuccess: () => {
      toast.success('스테이지가 수정되었습니다.');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('스테이지를 수정하는 데에 실패하였습니다.');
    },
  });

  const handleEditSave = () => {
    if (selectedStage)
      modifyStage({
        stageId: selectedStage.stageId,
        description: editForm.description,
      });
  };

  return (
    <>
      <Toaster expand={true} richColors position="bottom-center" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              스테이지 편집
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-5">
              <div>
                <Label
                  htmlFor="stage-name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  스테이지 이름
                </Label>
                <Input
                  id="stage-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-2"
                  disabled
                />
              </div>
              <div>
                <Label
                  htmlFor="stage-description"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  스테이지 설명 - <span className="text-gray-500">선택 사항</span>
                </Label>
                <Textarea
                  id="stage-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="mt-2 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={!editForm.description}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
