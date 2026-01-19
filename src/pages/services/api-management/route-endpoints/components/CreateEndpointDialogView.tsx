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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CreateEndpointDialogViewProps {
  isOpen: boolean;
  routeUrl: string;
  routeName: string;
  description: string;
  hasUrlError: boolean;
  isSubmitDisabled: boolean;
  routeOption: string;
  onClose: () => void;
  onRouteUrlChange: (value: string) => void;
  onRouteNameChange: (value: string) => void;
  onRouteOptionChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

export default function CreateEndpointDialogView({
  isOpen,
  routeUrl,
  routeName,
  description,
  hasUrlError,
  isSubmitDisabled,
  routeOption,
  onClose,
  onRouteUrlChange,
  onRouteNameChange,
  onRouteOptionChange,
  onDescriptionChange,
  onSubmit,
}: CreateEndpointDialogViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
            Route Endpoint 생성
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="create-routeName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Route Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="create-routeName"
              value={routeName}
              onChange={(e) => onRouteNameChange(e.target.value)}
              placeholder="POST 메서드 엔드포인트"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="create-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Route Endpoint URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="create-url"
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
          {/* <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Route Option <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={routeOption}
              onValueChange={(value) => onRouteOptionChange(value)}
              className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AUTO" id="AUTO" />
                <Label
                  htmlFor="AUTO"
                  className={`text-sm hover:cursor-pointer`}>
                  자동 생성
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DIRECT" id="DIRECT" />
                <Label
                  htmlFor="DIRECT"
                  className={`text-sm hover:cursor-pointer`}>
                  직접 입력
                </Label>
              </div>
            </RadioGroup>
          </div> */}
          <div>
            <Label htmlFor="create-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
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
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
