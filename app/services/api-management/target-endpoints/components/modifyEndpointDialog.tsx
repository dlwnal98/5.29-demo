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

interface formDataState {
  targetId: string;
  url: string;
  description: string;
}

interface modifyEndpointProps {
  isEditModalOpen: boolean;
  formData: formDataState;
  setFormData: React.Dispatch<React.SetStateAction<formDataState>>;
  handleModalClose: any;
  handleEditSubmit: any;
}

export default function ModifyEndpointDialog({
  isEditModalOpen,
  formData,
  setFormData,
  handleModalClose,
  handleEditSubmit,
}: modifyEndpointProps) {
  return (
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
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="엔드포인트 설명을 입력하세요"
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={handleModalClose}>
            취소
          </Button>
          <Button onClick={handleEditSubmit}>수정</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
