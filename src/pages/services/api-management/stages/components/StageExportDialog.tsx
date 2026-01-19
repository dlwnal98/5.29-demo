import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStageDocForExport, getStageDocForExportPreview } from '@/apis/stages.api';

type ExportFormat = 'OPENAPI_JSON' | 'OPENAPI_YAML' | 'POSTMAN';

interface StageExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStageId: string;
  stageName: string;
}

const StageExportDialog = ({
  open,
  onOpenChange,
  selectedStageId,
  stageName,
}: StageExportDialogProps) => {
  const [format, setFormat] = useState<ExportFormat>('OPENAPI_JSON');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchPreview = useCallback(async () => {
    if (!selectedStageId || !open) return;

    setIsLoading(true);
    try {
      const res = await getStageDocForExportPreview(selectedStageId, format, true);
      if (typeof res === 'string') {
        setPreviewContent(res);
      } else {
        setPreviewContent(JSON.stringify(res, null, 2));
      }
    } catch (error) {
      toast.error('Failed to load preview.');
      setPreviewContent('');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStageId, format, open]);

  useEffect(() => {
    if (open) {
      fetchPreview();
    }
  }, [open, fetchPreview]);

  useEffect(() => {
    if (!open) {
      setPreviewContent('');
      setFormat('OPENAPI_JSON');
    }
  }, [open]);

  const handleFormatChange = (value: ExportFormat) => {
    setFormat(value);
  };

  const handleDownload = async () => {
    if (!selectedStageId) return;

    setIsDownloading(true);
    try {
      const res = await getStageDocForExport(selectedStageId, format, true);

      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === 'OPENAPI_JSON' || format === 'POSTMAN') {
        content = typeof res === 'string' ? res : JSON.stringify(res, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else {
        content = typeof res === 'string' ? res : JSON.stringify(res, null, 2);
        mimeType = 'text/yaml';
        extension = 'yaml';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${stageName || 'stage'}-${format.toLowerCase()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('File downloaded successfully.');
    } catch (error) {
      toast.error('Failed to download file.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">Export Stage</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {stageName ? `"${stageName}" Stage to export.` : 'Stage to export.'} Format to select and confirm preview before download.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Export Format
            </Label>
            <Select value={format} onValueChange={handleFormatChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPENAPI_JSON">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">OpenAPI JSON</span>
                    <span className="text-xs text-gray-500">JSON format OpenAPI 3.0 document</span>
                  </div>
                </SelectItem>
                <SelectItem value="OPENAPI_YAML">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">OpenAPI YAML</span>
                    <span className="text-xs text-gray-500">YAML format OpenAPI 3.0 document</span>
                  </div>
                </SelectItem>
                <SelectItem value="POSTMAN">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Postman Collection</span>
                    <span className="text-xs text-gray-500">Postman Collection format</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Preview
            </Label>
            <div className="border rounded-lg bg-gray-50 dark:bg-gray-900 min-h-[400px] max-h-[400px] overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading preview...</span>
                </div>
              ) : previewContent ? (
                <pre className="text-xs p-4 font-mono whitespace-pre-wrap break-all">
                  {previewContent}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-sm text-gray-500">
                  No preview content available.
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || isLoading || !previewContent}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StageExportDialog;
