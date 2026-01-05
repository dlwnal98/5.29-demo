import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModelData } from "@/hooks/use-model";

interface ModifyModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: Partial<ModelData>;
  userKey: string;
}

export default function ModifyModelDialog({
  open,
  onOpenChange,
  selectedModel,
}: ModifyModelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
            모델 상세
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">모델 ID</Label>
            <Input
              value={selectedModel.modelId || ""}
              readOnly
              disabled
              className="mt-2 bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">모델 이름</Label>
            <Input
              value={selectedModel.modelName || ""}
              readOnly
              disabled
              className="mt-2 bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">설명</Label>
            <Textarea
              value={selectedModel.description || ""}
              readOnly
              disabled
              className="mt-2 bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Schema</Label>
            <Textarea
              value={
                selectedModel.jsonSchema
                  ? JSON.stringify(selectedModel.jsonSchema, null, 2)
                  : ""
              }
              readOnly
              disabled
              className="mt-2 bg-gray-50 dark:bg-gray-800 font-mono text-sm min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
