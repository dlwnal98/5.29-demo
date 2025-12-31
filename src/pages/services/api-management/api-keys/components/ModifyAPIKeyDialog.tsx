import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiKey } from "@/api/apiKeys.api";

interface ModifyAPIKeyDialogProps {
  isOpen: boolean;
  editingApiKey: ApiKey | null;
  onClose: () => void;
  onEditingApiKeyChange: (value: ApiKey | null) => void;
  onSubmit: (keyId: string, keyName: string, description: string) => void;
}

export default function ModifyAPIKeyDialog({
  isOpen,
  editingApiKey,
  onClose,
  onEditingApiKeyChange,
  onSubmit,
}: ModifyAPIKeyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
            API Key 수정
          </DialogTitle>
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
                  onEditingApiKeyChange({
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
                  onEditingApiKeyChange({
                    ...editingApiKey,
                    description: e.target.value,
                  })
                }
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button
                onClick={() =>
                  onSubmit(
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
