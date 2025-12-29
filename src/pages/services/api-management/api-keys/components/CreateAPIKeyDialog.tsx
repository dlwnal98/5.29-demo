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

interface NewApiKeyForm {
  keyName: string;
  description: string;
}

interface CreateAPIKeyDialogProps {
  isOpen: boolean;
  newApiKey: NewApiKeyForm;
  onClose: () => void;
  onNewApiKeyChange: (value: NewApiKeyForm) => void;
  onSubmit: () => void;
}

export default function CreateAPIKeyDialog({
  isOpen,
  newApiKey,
  onClose,
  onNewApiKeyChange,
  onSubmit,
}: CreateAPIKeyDialogProps) {
  const { keyName, description } = newApiKey;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
            API Key 생성
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="keyName" className="text-sm font-medium">
              이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="keyName"
              value={keyName}
              onChange={(e) =>
                onNewApiKeyChange({ ...newApiKey, keyName: e.target.value })
              }
              placeholder=""
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              설명
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) =>
                onNewApiKeyChange({ ...newApiKey, description: e.target.value })
              }
              placeholder=""
              className="mt-2 min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={onSubmit} disabled={!keyName}>
              발급
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
