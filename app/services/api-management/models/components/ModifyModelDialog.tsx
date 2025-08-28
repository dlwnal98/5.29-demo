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

interface ModifyModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renderModelForm: () => React.ReactElement;
}

export default function ModifyModelDialog({
  open,
  onOpenChange,
  renderModelForm,
}: ModifyModelDialogProps) {
  const handleModifyModel = () => {
    toast.success('모델이 성공적으로 생성되었습니다.');
  };
  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">모델 편집</DialogTitle>
            <DialogDescription className="text-gray-600">
              기존 모델을 편집합니다. (<span className="text-red-500">*</span> 필수 입력
              사항입니다.)
            </DialogDescription>
          </DialogHeader>

          {renderModelForm()}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}>
              취소
            </Button>
            <Button
              onClick={handleModifyModel}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
