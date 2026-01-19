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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface NewApiKeyForm {
  keyName: string;
  expiresAt?: string;
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
            Create API Key
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="keyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Name <span className="text-red-500">*</span>
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
          <div className="space-y-2">
            <Label className="text-sm">Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-8 justify-start text-left font-normal"
                >
                  {newApiKey.expiresAt ? (
                    format(new Date(newApiKey.expiresAt), 'yyyy-MM-dd HH:mm:ss', { locale: ko })
                  ) : (
                    <span className="text-gray-400">Select expiration date (optional)</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Calendar
                  mode="single"
                  // selected 역시 Date 객체여야 하므로 변환해줍니다.
                  selected={newApiKey.expiresAt ? new Date(newApiKey.expiresAt) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');

                      // 문자열로 생성
                      const localExpiresAt = `${year}-${month}-${day}T23:59:59`;

                      onNewApiKeyChange({ ...newApiKey, expiresAt: localExpiresAt });
                    } else {
                      onNewApiKeyChange({ ...newApiKey, expiresAt: '' });
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500">
              If not set, the key will be valid indefinitely.
            </p>
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
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
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!keyName}>
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
