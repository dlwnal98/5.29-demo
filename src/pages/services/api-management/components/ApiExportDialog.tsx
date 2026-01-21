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
import { getAPIDocForExport, getAPIDocForExportPreview } from '@/apis/api-management.api';

type ExportFormat = 'OPENAPI_JSON' | 'OPENAPI_YAML' | 'POSTMAN';

interface ApiExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAPIId: string;
  apiName: string;
}

const ApiExportDialog = ({
  open,
  onOpenChange,
  selectedAPIId,
  apiName,
}: ApiExportDialogProps) => {
  const [format, setFormat] = useState<ExportFormat>('OPENAPI_JSON');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchPreview = useCallback(async () => {
    if (!selectedAPIId || !open) return;

    setIsLoading(true);
    try {
      const res = await getAPIDocForExportPreview(selectedAPIId, format, true, true);
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
  }, [selectedAPIId, format, open]);

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
    if (!selectedAPIId) return;

    setIsDownloading(true);
    try {
      const res = await getAPIDocForExport(selectedAPIId, format, true, true);

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
      link.download = `${apiName || 'api'}-${format.toLowerCase()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('File has been downloaded.');
    } catch (error) {
      toast.error('Download failed.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getFormatLabel = (format: ExportFormat) => {
    switch (format) {
      case 'OPENAPI_JSON':
        return 'OpenAPI JSON';
      case 'OPENAPI_YAML':
        return 'OpenAPI YAML';
      case 'POSTMAN':
        return 'Postman Collection';
      default:
        return format;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {/* 상단 고정 영역: 헤더 + 내보내기 형식 */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 px-6 pt-6 pb-4 border-b ">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">API 내보내기</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {apiName ? `"${apiName}" API 내보내기.` : 'API를 파일로 내보냅니다.'} 형식을 선택하고 미리보기를 확인한 후 다운로드합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              내보내기 형식
            </Label>
            <Select value={format} onValueChange={handleFormatChange}>
              <SelectTrigger className="w-full h-[50px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPENAPI_JSON">
                  <div className="flex flex-col items-start ">
                    <span className="font-medium">OpenAPI JSON</span>
                    <span className="text-xs text-gray-500">OpenAPI 3.0 문서 JSON 형식</span>
                  </div>
                </SelectItem>
                <SelectItem value="OPENAPI_YAML">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">OpenAPI YAML</span>
                    <span className="text-xs text-gray-500">OpenAPI 3.0 문서 YAML 형식</span>
                  </div>
                </SelectItem>
                <SelectItem value="POSTMAN">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Postman Collection</span>
                    <span className="text-xs text-gray-500">Postman으로 가져올 수 있는 Collection 형식</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 스크롤 영역: 미리보기 본문 */}
        <div className="px-6 py-4">
          {/* <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            미리보기
          </Label> */}
          <div className="border rounded-lg bg-gray-50 dark:bg-gray-900">
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-500">미리보기를 로딩중입니다...</span>
              </div>
            ) : previewContent ? (
              <pre className="text-xs p-4 font-mono whitespace-pre-wrap break-all">
                {previewContent}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">
                미리보기가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <DialogFooter className="px-6 pb-6 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading || isLoading || !previewContent}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                저장 중...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                저장
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiExportDialog;
