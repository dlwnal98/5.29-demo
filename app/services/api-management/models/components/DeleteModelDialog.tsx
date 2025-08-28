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
import { Trash2, AlertTriangle } from 'lucide-react';
import { useDeleteModel } from '@/hooks/use-model';

interface Model {
  id: string;
  name: string;
  contentType: string;
  description: string;
  schema: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

interface DeleteModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectModels: string[];
  modelToDelete: Model | null;
}

export default function DeleteModelDialog({
  open,
  onOpenChange,
  selectedModels,
  modelToDelete,
}: DeleteModelDialogProps) {
  const { mutate: deleteModel } = useDeleteModel({
    onSuccess: () => {
      onOpenChange(false);
      toast.success('삭제되었습니다.');
    },
  });

  const handleDeleteModel = () => {
    deleteModel(modelToDelete?.id);
  };

  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-4">
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              모델 삭제
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-800 mb-2">
                  ⚠️ 이 작업은 실행 취소할 수 없습니다.
                </p>
                {selectedModels.length > 1 ? (
                  <p className="text-red-700 text-sm">
                    선택된 <strong>{selectedModels.length}개의 모델</strong>이 영구적으로
                    삭제됩니다.
                    <br />이 모델들을 사용하는 모든 API 메서드에 영향을 줄 수 있습니다.
                  </p>
                ) : (
                  <p className="text-red-700 text-sm">
                    <strong>'{modelToDelete?.name}'</strong> 모델이 영구적으로 삭제됩니다.
                    <br />이 모델을 사용하는 모든 API 메서드에 영향을 줄 수 있습니다.
                  </p>
                )}
                {modelToDelete && modelToDelete.usageCount > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-yellow-800 text-sm font-medium">
                      현재 {modelToDelete.usageCount}개의 API에서 사용 중입니다.
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                //   setModelToDelete(null);
              }}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteModel}
              className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
