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
import { useState, useEffect } from 'react';
import { useModifyEndpoint } from '@/hooks/use-endpoints';
import { toast, Toaster } from 'sonner';

interface formDataState {
  targetId: string;
  url: string;
  description: string;
}

interface modifyEndpointProps {
  isEditModalOpen: boolean;
  formData: formDataState;
  handleModalClose: any;
  updatedBy: string;
  targetId: string;
}

export default function ModifyEndpointDialog({
  isEditModalOpen,
  formData,
  handleModalClose,
  updatedBy,
  targetId,
}: modifyEndpointProps) {
  const [modifyForm, setModifyForm] = useState({
    url: formData.url,
    description: formData.description,
  });

  useEffect(() => {
    setModifyForm({
      url: formData.url,
      description: formData.description,
    });
  }, [formData]);

  const { mutate: modifyEndpoint } = useModifyEndpoint({
    onSuccess: () => {
      toast.success('endpoint가 수정되었습니다.');
      handleModalClose();
    },
    onError: () => {
      toast.error('endpoint를 수정하는 데 실패하였습니다.');
    },
  });

  const handleModifyEndpoint = () => {
    if (updatedBy)
      modifyEndpoint({
        targetId: targetId,
        data: {
          targetEndpoint: modifyForm.url,
          description: modifyForm.description,
          updatedBy: updatedBy,
        },
      });
  };

  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />

      <Dialog open={isEditModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-2">Target Endpoint 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-url" className="text-sm font-medium">
                Endpoint URL *
              </Label>
              <Input
                id="edit-url"
                value={modifyForm.url}
                onChange={(e) => setModifyForm({ ...modifyForm, url: e.target.value })}
                placeholder="https://api.example.com/v1"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">
                설명
              </Label>
              <Textarea
                id="edit-description"
                value={modifyForm.description}
                onChange={(e) => setModifyForm({ ...modifyForm, description: e.target.value })}
                placeholder="엔드포인트 설명을 입력하세요"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleModalClose}>
              취소
            </Button>
            <Button onClick={handleModifyEndpoint}>수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
