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
import { Switch } from '@/components/ui/switch';
import { getAPIDocForExport, getAPIDocForExportPreview } from '@/apis/api-management.api';

type ExportFormat = 'OPENAPI_JSON' | 'OPENAPI_YAML' | 'POSTMAN';

interface ResourceExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiId: string;
  apiName: string;
}

const ResourceExportDialog = ({
  open,
  onOpenChange,
  apiId,
  apiName,
}: ResourceExportDialogProps) => {
  const [format, setFormat] = useState<ExportFormat>('OPENAPI_JSON');
  const [includeExtensions, setIncludeExtensions] = useState(true);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchPreview = useCallback(async () => {
    if (!apiId || !open) return;

    setIsLoading(true);
    try {
      const res = await getAPIDocForExportPreview(apiId, format, true, includeExtensions);
      if (typeof res === 'string') {
        setPreviewContent(res);
      } else {
        setPreviewContent(JSON.stringify(res, null, 2));
      }
    } catch (error) {
      toast.error('미리보기를 불러오지 못했습니다.');
      setPreviewContent('');
    } finally {
      setIsLoading(false);
    }
  }, [apiId, format, includeExtensions, open]);

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
    if (!apiId) return;

    setIsDownloading(true);
    try {
      const res = await getAPIDocForExport(apiId, format, true, includeExtensions);

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

      toast.success('파일이 다운로드되었습니다.');
    } catch (error) {
      toast.error('다운로드에 실패했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {/* 상단 고정 영역: 헤더 + 내보내기 형식 */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">API 내보내기</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {apiName ? `"${apiName}" API를 내보냅니다.` : 'API를 파일로 내보냅니다.'} 형식을 선택하고 미리보기를 확인한 후 다운로드합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              내보내기 형식
            </Label>
            <Select value={format} onValueChange={handleFormatChange}>
              <SelectTrigger className="w-full h-[50px]">
                <SelectValue placeholder="형식 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPENAPI_JSON">
                  <div className="flex flex-col items-start">
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

          <div className="mt-4 flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                확장 필드 포함
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                x-amazon-apigateway 등 확장 필드를 포함합니다.
              </p>
            </div>
            <Switch
              checked={includeExtensions}
              onCheckedChange={setIncludeExtensions}
            />
          </div>
        </div>

        {/* 스크롤 영역: 미리보기 본문 */}
        <div className="px-6 py-4">
          <div className="border rounded-lg bg-gray-50 dark:bg-gray-900 relative min-h-[200px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 z-10 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-500">미리보기를 로딩중입니다...</span>
              </div>
            )}
            {previewContent ? (
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

export default ResourceExportDialog;
