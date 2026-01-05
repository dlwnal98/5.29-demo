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
import { useState } from "react";
import { useCreateModel } from "@/hooks/use-model";
import { toast } from "sonner";

interface CreateModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiId: string;
  userKey: string;
}

export default function CreateModelDialog({
  open,
  onOpenChange,
  apiId,
  userKey,
}: CreateModelDialogProps) {
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createModel } = useCreateModel({
    onSuccess: () => {
      toast.success("모델이 생성되었습니다.");
      onOpenChange(false);
      setModelName("");
      setDescription("");
    },
    onError: () => {
      toast.error("모델 생성에 실패했습니다.");
    },
  });

  const handleSubmit = () => {
    createModel({
      apiId,
      modelName,
      description,
      jsonSchema: {
        type: "object",
        properties: {},
      },
      examples: [],
      createdBy: userKey,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
            모델 생성
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="modelName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              모델 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="모델 이름을 입력하세요"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              설명
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="모델 설명을 입력하세요"
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!modelName}>
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
