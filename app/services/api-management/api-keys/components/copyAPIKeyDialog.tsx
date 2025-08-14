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
import { Copy } from 'lucide-react';
import { ApiKey } from '@/hooks/use-apiKeys';
import { useClipboard } from 'use-clipboard-copy';
import { toast, Toaster } from 'sonner';

interface copyAPIKeyProps {
  isCopyModalOpen: boolean;
  setIsCopyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  copyApiKey: string;
}

export default function CopyAPIKeyDialog({
  isCopyModalOpen,
  setIsCopyModalOpen,
  copyApiKey,
}: copyAPIKeyProps) {
  const clipboard = useClipboard();

  return (
    <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>발급된 API Key</DialogTitle>
          <DialogDescription>발급된 API Key를 복사할 수 있습니다.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <button
                className=" w-[100%] flex justify-between items-center hover:underline"
                onClick={() => {
                  clipboard.copy(copyApiKey);
                  toast.success('API Key가 복사되었습니다.');
                }}
              >
                <span className="block w-[90%] whitespace-normal break-words text-left">
                  {copyApiKey}
                </span>

                <Copy className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
        <DialogFooter className="!flex !justify-center">
          <Button
            variant="default"
            className="bg-amber-400 hover:bg-amber-500"
            onClick={() => {
              setIsCopyModalOpen(false);
            }}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
