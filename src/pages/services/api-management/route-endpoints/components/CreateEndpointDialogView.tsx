import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CreateEndpointDialogViewProps {
  isOpen: boolean;
  url: string;
  description: string;
  hasUrlError: boolean;
  isSubmitDisabled: boolean;
  onClose: () => void;
  onUrlChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

export default function CreateEndpointDialogView({
  isOpen,
  url,
  description,
  hasUrlError,
  isSubmitDisabled,
  onClose,
  onUrlChange,
  onDescriptionChange,
  onSubmit,
}: CreateEndpointDialogViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
            Target Endpoint 생성
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="create-url" className="text-sm font-medium">
              Endpoint URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="create-url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="mt-2"
            />
            {hasUrlError && (
              <span className="text-xs mt-2 ml-2 text-red-500">
                한글은 입력이 불가합니다.
              </span>
            )}
          </div>
          <div>
            <Label htmlFor="create-description" className="text-sm font-medium">
              설명
            </Label>
            <Textarea
              id="create-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="엔드포인트 설명을 입력하세요"
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled}>
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
