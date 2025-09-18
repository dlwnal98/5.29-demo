'use client';

import React, { useState } from 'react';
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

interface ModifyStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  userKey: string;
  apiId: string;
  selectedStage: {
    name: string;
    description: string;
  };
}

export default function ModifyStageDialog({
  open,
  onOpenChange,
  organizationId,
  userKey,
  apiId,
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

  const handleEditSave = () => {};

  return (
    <>
      <Toaster expand={true} richColors position="bottom-center" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              스테이지 편집
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                스테이지 세부 정보
              </h3>
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
                  className="mt-1"
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
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleEditSave} className="bg-blue-500 hover:bg-blue-600 text-white">
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
