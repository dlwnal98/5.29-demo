import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateResourceForm } from '../hooks/useResourceCreateDialog';

interface ResourceCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createResourceForm: CreateResourceForm;
  resourcePaths: string[];
  pathPattern: string;
  checkUrl: boolean;
  isPending?: boolean;
  onCreateResource: () => void;
  onResourceNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onEnableCorsChange: (checked: boolean) => void;
  onPathPatternChange: (value: string) => void;
  onCancel: () => void;
}

export function ResourceCreateDialog({
  open,
  onOpenChange,
  createResourceForm,
  resourcePaths,
  pathPattern,
  checkUrl,
  isPending,
  onCreateResource,
  onResourceNameChange,
  onDescriptionChange,
  onEnableCorsChange,
  onPathPatternChange,
  onCancel,
}: ResourceCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">Resource Create</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Resource Path and Name - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="resource-path"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Resource Path<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={pathPattern ? pathPattern : '/'}
                onValueChange={onPathPatternChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a path" />
                </SelectTrigger>
                <SelectContent>
                  {resourcePaths.map((path) => (
                    <SelectItem key={path} value={path}>
                      {path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="resource-name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Resource Name<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="resource-name"
                placeholder=""
                value={createResourceForm.resourceName}
                onChange={(e) => onResourceNameChange(e.target.value)}
              />
              {checkUrl && (
                <span className="text-xs mt-2 ml-2 text-red-500">Korean is not allowed.</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <Label
                htmlFor="resource-description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Resource Description
              </Label>
              <Textarea
                id="resource-description"
                placeholder=""
                value={createResourceForm.description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="min-h-[50px] text-sm resize-none"
              />
            </div>
          </div>
          {/* CORS Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label
                htmlFor="cors-toggle"
                className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CORS from Source
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Creates an OPTIONS method that allows all origins, all methods, and a few common headers.
              </p>
            </div>
            <Switch
              id="cors-toggle"
              checked={createResourceForm.enableCors}
              onCheckedChange={onEnableCorsChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onCreateResource}
            disabled={!createResourceForm.resourceName || isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white">
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
