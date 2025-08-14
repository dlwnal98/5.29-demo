import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { ApiKey } from '@/hooks/use-apiKeys';

interface modifyAPIKeyProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingApiKey: React.Dispatch<React.SetStateAction<ApiKey | null>>;
  handleUpdateApiKey: any;
  editingApiKey: ApiKey | null;
}

export default function ModifyAPIKeyDialog({
  isEditModalOpen,
  setIsEditModalOpen,
  setEditingApiKey,
  editingApiKey,
  handleUpdateApiKey,
}: modifyAPIKeyProps) {
  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>API Key 수정</DialogTitle>
        </DialogHeader>
        {editingApiKey && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="edit-id" className="text-sm font-medium">
                ID
              </Label>
              <Input
                id="edit-id"
                value={editingApiKey.keyId}
                readOnly
                disabled
                className="mt-1 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Label htmlFor="edit-name" className="text-sm font-medium">
                이름
              </Label>
              <Input
                id="edit-name"
                value={editingApiKey.name}
                onChange={(e) =>
                  setEditingApiKey({
                    ...editingApiKey,
                    name: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-description" className="text-sm font-medium">
                설명 - 선택 사항
              </Label>
              <Textarea
                id="edit-description"
                value={editingApiKey.description}
                onChange={(e) =>
                  setEditingApiKey({
                    ...editingApiKey,
                    description: e.target.value,
                  })
                }
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                취소
              </Button>
              <Button
                onClick={() =>
                  handleUpdateApiKey(
                    editingApiKey.keyId,
                    editingApiKey.name,
                    editingApiKey.description
                  )
                }
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                수정
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
