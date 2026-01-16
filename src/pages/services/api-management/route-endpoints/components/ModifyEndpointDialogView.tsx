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

interface ModifyEndpointDialogViewProps {
  isOpen: boolean;
  routeName: string;
  routeUrl: string;
  description: string;
  hasUrlError: boolean;
  onClose: () => void;
  onRouteNameChange: (value: string) => void;
  onRouteUrlChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

export default function ModifyEndpointDialogView({
  isOpen,
  routeName,
  routeUrl,
  description,
  hasUrlError,
  onClose,
  onRouteNameChange,
  onRouteUrlChange,
  onDescriptionChange,
  onSubmit,
}: ModifyEndpointDialogViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
            Route Endpoint 수정
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-routeName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Route Endpoint Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-routeName"
              value={routeName}
              onChange={(e) => onRouteNameChange(e.target.value)}
              placeholder="https://api.example.com/v1"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="edit-routeUrl" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Endpoint URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-routeUrl"
              value={routeUrl}
              onChange={(e) => onRouteUrlChange(e.target.value)}
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
            <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              설명
            </Label>
            <Textarea
              id="edit-description"
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
          <Button onClick={onSubmit}>수정</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
