import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteEndpointDialogViewProps {
  isOpen: boolean;
  routeUrl: string;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteEndpointDialogView({
  isOpen,
  routeUrl,
  onClose,
  onDelete,
}: DeleteEndpointDialogViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center text-red-600 text-xl">
            Route Endpoint 삭제
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
              ⚠️ 되돌릴 수 없는 작업입니다.
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm mb-3">
              <strong>{routeUrl}</strong> 주소의 Route Endpoint가 영구적으로 삭제됩니다.
              <br />
              연결된 모든 API 및 설정에 영향을 미칠 수 있습니다.
            </p>
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
