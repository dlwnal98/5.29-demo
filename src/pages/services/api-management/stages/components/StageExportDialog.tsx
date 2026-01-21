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
      const res = await getStageDocForExportPreview(selectedStageId, format, false);
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
      const res = await getStageDocForExport(selectedStageId, format, false);

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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {/* 상단 고정 영역: 헤더 + 내보내기 형식 */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">Stage 내보내기</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {stageName ? `"${stageName}" Stage 내보내기.` : 'Stage 내보내기.'} Format을 선택하고 다운로드 전 미리보기를 확인하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              내보내기 형식
            </Label>
            <Select value={format} onValueChange={handleFormatChange}>
              <SelectTrigger className="w-full h-[50px]">
                <SelectValue placeholder="내보내기 형식 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPENAPI_JSON">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">OpenAPI JSON</span>
                    <span className="text-xs text-gray-500">JSON 형식 OpenAPI 3.0 문서</span>
                  </div>
                </SelectItem>
                <SelectItem value="OPENAPI_YAML">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">OpenAPI YAML</span>
                    <span className="text-xs text-gray-500">YAML 형식 OpenAPI 3.0 문서</span>
                  </div>
                </SelectItem>
                <SelectItem value="POSTMAN">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Postman Collection</span>
                    <span className="text-xs text-gray-500">Postman Collection 형식</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 스크롤 영역: 미리보기 본문 */}
        <div className="px-6 py-4">
          <div className="border rounded-lg bg-gray-50 dark:bg-gray-900">
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-500">미리보기 로딩 중...</span>
              </div>
            ) : previewContent ? (
              <pre className="text-xs p-4 font-mono whitespace-pre-wrap break-all">
                {previewContent}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">
                미리보기 콘텐츠가 없습니다.
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

export default StageExportDialog;
