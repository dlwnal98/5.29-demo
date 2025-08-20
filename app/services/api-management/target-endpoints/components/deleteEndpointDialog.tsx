import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { TargetEndpoint } from '../page';

interface deleteEndpointProps {
  isDeleteModalOpen: boolean;
  selectedIds: string[];
  endpoints: TargetEndpoint[];
  handleModalClose: any;
  handleDeleteConfirm: any;
}

export default function DeleteEndpointDialog({
  isDeleteModalOpen,
  selectedIds,
  endpoints,
  handleModalClose,
  handleDeleteConfirm,
}: deleteEndpointProps) {
  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Target Endpoint 삭제
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-red-800 mb-2">⚠️ 이 작업은 실행 취소할 수 없습니다.</p>
            <p className="text-red-700 text-sm mb-3">
              선택된 Target Endpoint가 영구적으로 삭제됩니다.
              <br />
              연결된 모든 API와 설정이 영향을 받을 수 있습니다.
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
            <p className="text-sm font-medium mb-2">삭제될 항목:</p>
            {selectedIds.map((id) => {
              const endpoint = endpoints.find((e) => e.id === id);
              return endpoint ? (
                <div key={id} className="text-xs text-gray-600 mb-1">
                  • <strong>{endpoint.targetId}</strong> - {endpoint.url}
                </div>
              ) : null;
            })}
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={handleModalClose}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            className="bg-red-600 hover:bg-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
