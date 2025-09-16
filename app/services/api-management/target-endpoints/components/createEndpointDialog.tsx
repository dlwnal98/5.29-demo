'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useCreateEndpoint } from '@/hooks/use-endpoints';
import { toast, Toaster } from 'sonner';
import { onInputChange, onSave } from '@/lib/etc';

interface createEndpointProps {
  isCreateModalOpen: boolean;
  handleModalClose: any;
  organizationId: string;
  createdBy: string;
}

export default function CreateEndpointDialog({
  isCreateModalOpen,
  handleModalClose,
  organizationId,
  createdBy,
}: createEndpointProps) {
  const [endpointForm, setEndpointForm] = useState({
    url: '',
    description: '',
  });

  const { mutate: createEndpoint } = useCreateEndpoint({
    onSuccess: () => {
      toast.success('endpoint가 생성되었습니다.');
      handleModalClose();
    },
    onError: () => {
      toast.error('endpoint를 생성하는 데 실패하였습니다.');
    },
  });

  const handleCreateEndpoint = () => {
    if (onSave(endpointForm.url)) {
      if (organizationId && createdBy)
        createEndpoint({
          organizationId: organizationId,
          targetEndpoint: endpointForm.url,
          description: endpointForm.description,
          createdBy: createdBy,
        });
    } else toast.error('유효하지 않은 url 형식입니다.');
  };

  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />

      <Dialog open={isCreateModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-2">Target Endpoint 생성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-url" className="text-sm font-medium">
                Endpoint URL *
              </Label>
              <Input
                id="create-url"
                value={endpointForm.url}
                onChange={(e) => {
                  if (onInputChange(e.target.value))
                    setEndpointForm({ ...endpointForm, url: e.target.value });
                }}
                placeholder="https://api.example.com/v1"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="create-description" className="text-sm font-medium">
                설명
              </Label>
              <Textarea
                id="create-description"
                value={endpointForm.description}
                onChange={(e) => setEndpointForm({ ...endpointForm, description: e.target.value })}
                placeholder="엔드포인트 설명을 입력하세요"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleModalClose}>
              취소
            </Button>
            <Button onClick={handleCreateEndpoint}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
