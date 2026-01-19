import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteEndpointDialogViewProps {
  isOpen: boolean;
  routeUrl: string;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteEndpointDialogView({
  isOpen,
  routeUrl,
  onClose,
  onDelete,
}: DeleteEndpointDialogViewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Route Endpoint
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
              ⚠️ This action cannot be undone.
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm mb-3">
              <strong>{routeUrl}</strong> address Route Endpoint will be permanently deleted.
              <br />
              All connected APIs and settings may be affected.
            </p>
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
