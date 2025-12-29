import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { useDeleteModel } from "@/hooks/use-model";
import { toast } from "sonner";

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
      toast.success("모델이 삭제되었습니다.");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("모델 삭제에 실패했습니다.");
    },
  });

  const handleDelete = () => {
    deleteModel({ modelId, userKey });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            모델 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <div className="text-gray-700 dark:text-gray-300">
              <strong className="text-red-600">경고:</strong> 이 작업은 되돌릴 수
              없습니다.
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              모델 <strong className="text-red-600">"{modelName}"</strong>이
              영구적으로 삭제됩니다.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
