'use client';

import React, { use, useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateStage } from '@/hooks/use-stages';
import { toast, Toaster } from 'sonner';
import { useGetDeployHistoryData } from '@/hooks/use-stages';

interface CreateStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  userKey: string;
  apiId: string;
}

export default function CreateStageDialog({
  open,
  onOpenChange,
  organizationId,
  userKey,
  apiId,
}: CreateStageDialogProps) {
  const [createStageForm, setCreateStageForm] = useState({
    name: '',
    description: '',
  });

  const { data: deploymentHistoryData } = useGetDeployHistoryData(organizationId || '', 0, 20);

  const [selectedDeploymentRecord, setSelectedDeploymentRecord] = useState('');

  useEffect(() => {
    setCreateStageForm({ name: '', description: '' });
    setSelectedDeploymentRecord('');
  }, [open]);

  const { mutate: createStage } = useCreateStage({
    onSuccess: () => {
      setCreateStageForm({ name: '', description: '' });
      setSelectedDeploymentRecord('');
      toast.success('스테이지가 생성되었습니다.');
      onOpenChange(false);
    },
    onError: (error: any) => {
      setCreateStageForm({ name: '', description: '' });
      setSelectedDeploymentRecord('');
      const serverMessage = error?.response?.data?.message ?? '스테이지가 생성에 실패하였습니다.';
      toast.error(serverMessage);
    },
  });

  const handleCreateStage = () => {
    createStage({
      organizationId: organizationId,
      stageName: createStageForm.name,
      description: createStageForm.description,
      createdBy: userKey,
      enabled: true,
      deploymentSource: 'DRAFT',
      apiId: apiId,
      sourceDeploymentId: selectedDeploymentRecord,
    });
  };
  return (
    <>
      <Toaster expand={true} richColors position="bottom-center" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              스테이지 생성
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div>
              <Label
                htmlFor="create-stage-name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300">
                스테이지 이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-stage-name"
                value={createStageForm.name}
                onChange={(e) =>
                  setCreateStageForm({
                    ...createStageForm,
                    name: e.target.value,
                  })
                }
                placeholder="스테이지 이름을 입력하세요"
                className="mt-2"
              />
            </div>
            <div>
              <Label
                htmlFor="create-stage-description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300">
                스테이지 설명
              </Label>
              <Textarea
                id="create-stage-description"
                value={createStageForm.description}
                onChange={(e) =>
                  setCreateStageForm({
                    ...createStageForm,
                    description: e.target.value,
                  })
                }
                placeholder="스테이지 설명을 입력하세요 (선택사항)"
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600 block">
                배포 기록 선택 <span className="text-red-500">*</span>
              </Label>

              <Select value={selectedDeploymentRecord} onValueChange={setSelectedDeploymentRecord}>
                <SelectTrigger className="mt-2 h-[48px]">
                  <SelectValue placeholder="배포 기록을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {deploymentHistoryData?.map((record) => (
                    <SelectItem
                      key={record.deploymentId}
                      value={record.deploymentId}
                      className="cursor-pointer">
                      <div className="flex flex-col">
                        <div className="flex items-center text-left">
                          <div
                            className={`rounded-[999px] w-2 h-2 mr-2${record.status === 'ACTIVE' ? ' bg-green-500' : 'bg-red-500'} `}></div>
                          <span className="font-medium text-left">
                            {record.stageName} - {record.deploymentId}
                          </span>
                        </div>

                        <span className="text-xs text-gray-500">
                          {new Date(record.deployedAt).toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setCreateStageForm({ name: '', description: '' });
                setSelectedDeploymentRecord('');
              }}>
              취소
            </Button>
            <Button
              onClick={handleCreateStage}
              disabled={!selectedDeploymentRecord || !createStageForm.name}
              variant={'default'}
              className="transition-colors duration-200 ease-in-out">
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
