'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { requestGet } from '@/lib/apiClient';
import { CreateResourceProps, useCreateResource } from '@/hooks/use-resources';
import { toast } from 'sonner';

interface ResourceCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiId: string;
  userKey: string;
}

export function ResourceCreateDialog({
  open,
  onOpenChange,
  apiId,
  userKey,
}: ResourceCreateDialogProps) {
  const [createResourceForm, setCreateResourceForm] = useState({
    apiId: apiId,
    resourceName: '',
    description: '',
    path: '',
    enableCors: false,
    resourceType: 'REST',
    createdBy: userKey,
  });
  const [pathPattern, setPathPattern] = useState('');

  useEffect(() => {
    if (userKey) setCreateResourceForm({ ...createResourceForm, createdBy: userKey });
  }, [userKey]);

  const availableResourcePaths = ['/', '/api', '/users', '/products', '/orders'];

  const { mutate: createResourceMutate } = useCreateResource({
    onSuccess: () => {
      toast.success('리소스가 생성되었습니다.');
      onOpenChange(false);
    },
  });

  const createResource = async (data: CreateResourceProps) => {
    createResourceMutate(data);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setCreateResourceForm({
      apiId: apiId,
      resourceName: '',
      description: '',
      path: '',
      enableCors: false,
      resourceType: 'REST',
      createdBy: userKey,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">리소스 생성</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Resource Path and Name - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="resource-path"
                className="text-sm font-medium text-gray-700 mb-2 block">
                리소스 경로<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={pathPattern ? pathPattern : '/'}
                onValueChange={(value) =>
                  setCreateResourceForm({
                    ...createResourceForm,
                    path: value,
                  })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="경로를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {/* {resourcePaths.map((path) => ( */}
                  {availableResourcePaths.map((path) => (
                    <SelectItem key={path} value={path}>
                      {path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="resource-name"
                className="text-sm font-medium text-gray-700 mb-2 block">
                리소스 이름<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="resource-name"
                placeholder=""
                value={createResourceForm.resourceName}
                onChange={(e) =>
                  setCreateResourceForm({ ...createResourceForm, resourceName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <Label
                htmlFor="resource-description"
                className="text-sm font-medium text-gray-700 mb-2 block">
                리소스 설명
              </Label>
              <Textarea
                id="resource-description"
                placeholder=""
                value={createResourceForm.description}
                onChange={(e) => {
                  setCreateResourceForm({ ...createResourceForm, description: e.target.value });
                }}
                className="min-h-[50px] text-sm resize-none"
              />
            </div>
          </div>
          {/* CORS Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label
                htmlFor="cors-toggle"
                className="text-sm font-medium text-gray-700 dark:text-gray-300">
                원본에서 CORS
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                모든 오리진, 모든 메서드 및 몇 가지 공통 헤더를 허용하는 OPTIONS 메서드를
                생성합니다.
              </p>
            </div>
            <Switch
              id="cors-toggle"
              checked={createResourceForm.enableCors}
              onCheckedChange={(checked) =>
                setCreateResourceForm({
                  ...createResourceForm,
                  enableCors: checked,
                })
              }
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button
            onClick={() => createResource(createResourceForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white">
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
