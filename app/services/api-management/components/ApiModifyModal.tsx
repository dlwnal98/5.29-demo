import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useModifyAPI } from '@/hooks/use-apimanagement';

interface ApiModifyModalProps {
  userKey: string;
  selectedAPIId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingValue: { name: string; description: string };
}

const ApiModifyModal = ({
  userKey,
  selectedAPIId,
  open,
  onOpenChange,
  existingValue,
}: ApiModifyModalProps) => {
  const [form, setForm] = useState(existingValue);

  useEffect(() => {
    if (open) {
      setForm(existingValue);
    }
  }, [open, existingValue]);

  const { mutate: modifyAPI } = useModifyAPI({
    onSuccess: () => {
      onOpenChange(false);
      setForm(existingValue);
      toast.success(`API '${form.name}'이(가) 수정되었습니다.`);
    },
  });

  const handleModify = () => {
    if (!form.name.trim()) {
      toast.error('API 이름을 입력해주세요.');
      return;
    }

    modifyAPI({
      apiId: selectedAPIId,
      data: {
        name: form.name,
        description: form.description,
        updatedBy: userKey,
        enabled: true,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">API Plan 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* API Name */}
          <div>
            <Label htmlFor="api-name" className="text-sm font-medium text-gray-700 mb-2 block">
              API 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="api-name"
              placeholder="API 이름을 입력하세요"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </div>
          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
              설명
            </Label>
            <Textarea
              id="description"
              placeholder="설명을 입력하세요"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[100px] resize-none"
              maxLength={300}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {form.description.length}/300 자
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setForm(existingValue);
            }}>
            취소
          </Button>
          <Button onClick={handleModify} className="bg-blue-500 hover:bg-blue-600 text-white">
            수정
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiModifyModal;
