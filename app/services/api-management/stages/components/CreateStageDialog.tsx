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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createStage } from '@/hooks/use-stages';
import { toast, Toaster } from 'sonner';

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
  const [selectedDeploymentRecord, setSelectedDeploymentRecord] = useState('');

  const [isDirectUrlInput, setIsDirectUrlInput] = useState(false);
  const mockDeploymentRecords = [
    {
      id: '1',
      stageName: 'hello',
      date: 'July 03, 2025, 08:26 (UTC+09:00)',
      status: 'inactive',
      description: 'Initial deployment',
      deploymentId: 'eemowu',
    },
    {
      id: '2',
      stageName: 'nexfron',
      date: 'July 03, 2025, 08:26 (UTC+09:00)',
      status: 'inactive',
      description: 'Production update',
      deploymentId: 'jje6x',
    },
    {
      id: '3',
      stageName: 'hello',
      date: 'July 02, 2025, 17:44 (UTC+09:00)',
      status: 'active',
      description: 'Bug fix deployment',
      deploymentId: 'xf40pg',
    },
    {
      id: '4',
      stageName: 'nexfron',
      date: 'July 02, 2025, 17:42 (UTC+09:00)',
      status: 'inactive',
      description: 'Feature rollback',
      deploymentId: 'ussiri',
    },
  ];

  const handleCreateStage = async () => {
    const res = await createStage({
      organizationId: organizationId,
      stageName: createStageForm.name,
      description: createStageForm.description,
      createdBy: userKey,
      enabled: true,
      deploymentSource: 'DRAFT',
      apiId: apiId,
      sourceDeploymentId: selectedDeploymentRecord,
    });

    if (res) {
      setCreateStageForm({ name: '', description: '' });
      setSelectedDeploymentRecord('');
      toast.success('스테이지가 생성되었습니다.');
      onOpenChange(false);
      //그리고 스테이지 목록 갱신 되어야함
    } else {
      setCreateStageForm({ name: '', description: '' });
      setSelectedDeploymentRecord('');
      toast.error('스테이지 생성에 실패하였습니다.');
    }
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

          <div className="space-y-4 py-4">
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
                className="mt-1"
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
                className="mt-1"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600">배포 기록 선택 여부</Label>
                <Switch checked={isDirectUrlInput} onCheckedChange={setIsDirectUrlInput} />
              </div>
            </div>
            {isDirectUrlInput && (
              <div>
                <Select
                  value={selectedDeploymentRecord}
                  onValueChange={setSelectedDeploymentRecord}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="배포 기록을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDeploymentRecords.map((record) => (
                      <SelectItem key={record.id} value={record.deploymentId}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {record.stageName} - {record.deploymentId}
                          </span>
                          <span className="text-xs text-gray-500">
                            {record.date} ({record.status})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
              className="bg-orange-500 hover:bg-orange-600 text-white">
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
