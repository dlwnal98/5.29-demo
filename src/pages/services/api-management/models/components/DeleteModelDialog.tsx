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

interface DeleteModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelId: string;
  modelName: string;
  userKey: string;
}

export default function DeleteModelDialog({
  open,
  onOpenChange,
  modelId,
  modelName,
  userKey,
}: DeleteModelDialogProps) {
  const { mutate: deleteModel } = useDeleteModel({
    onSuccess: () => {
      onOpenChange(false);
      toast.success('Deleted successfully.');
    }, onError: (error) => {
      console.log(error)
      toast.error(error?.response?.data?.detail);

    }
  });

  const handleDeleteModel = () => {
    deleteModel({ modelId: modelId, userKey: userKey });
  };

  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-4">
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete Model
            </DialogTitle>
            <DialogDescription className="text-left space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-800 mb-2">
                  ⚠️ This action cannot be undone.
                </p>

                <p className="text-red-700 text-sm">
                  <strong>'{modelName}'</strong> model will be permanently deleted.
                  <br />All APIs and methods using this model may be affected.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteModel}
              className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}