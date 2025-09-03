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

interface ApiKeyState {
  keyName: string;
  description: string;
}

interface createAPIKeyProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  keyName: string;
  newApiKey: ApiKeyState;
  setNewApiKey: React.Dispatch<React.SetStateAction<ApiKeyState>>;
  description: string;
  handleCreateAPIKey: any;
}

export default function CreateAPIKeyDialog({
  isCreateModalOpen,
  setIsCreateModalOpen,
  newApiKey,
  setNewApiKey,
  handleCreateAPIKey,
}: createAPIKeyProps) {
  const { keyName, description } = newApiKey;

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>API Key 생성</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="keyName" className="text-sm font-medium">
              이름
            </Label>
            <Input
              id="keyName"
              value={keyName}
              onChange={(e) => setNewApiKey({ ...newApiKey, keyName: e.target.value })}
              placeholder=""
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              설명 - 선택 사항
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) =>
                setNewApiKey({
                  ...newApiKey,
                  description: e.target.value,
                })
              }
              placeholder=""
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              취소
            </Button>
            <Button
              onClick={() => handleCreateAPIKey()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={keyName.length === 0}>
              발급
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
