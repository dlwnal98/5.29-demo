import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useClipboard } from "use-clipboard-copy";
import { toast } from "sonner";

interface CopyAPIKeyDialogProps {
  isOpen: boolean;
  copyApiKey: string;
  onClose: () => void;
}

export default function CopyAPIKeyDialog({
  isOpen,
  copyApiKey,
  onClose,
}: CopyAPIKeyDialogProps) {
  const clipboard = useClipboard();

  const handleCopy = () => {
    clipboard.copy(copyApiKey);
    toast.success("API Key copied");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Issued API Key</DialogTitle>
          <DialogDescription>The API Key can be copied.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <button
                className="w-[100%] flex justify-between items-center hover:underline"
                onClick={handleCopy}
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
            onClick={onClose}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
