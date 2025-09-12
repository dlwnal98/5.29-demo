import React, { useEffect, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Globe } from 'lucide-react';
import type { Resource } from '@/types/resource';
import { useModifyResourceCorsSettings } from '@/hooks/use-resources';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

interface CorsSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceId: string;
  selectedResource: Resource;
  setSelectedResource: (resource: Resource) => void;
}

export function CorsSettingsDialog({
  open,
  onOpenChange,
  resourceId,
  selectedResource,
  setSelectedResource,
}: CorsSettingsDialogProps) {
  const [corsForm, setCorsForm] = useState({
    allowMethods: [],
    allowHeaders: [],
    allowOrigin: '',
    exposeHeaders: [],
    maxAge: '',
    allowCredentials: false,
  });

  // useEffect(() => {
  //   setCorsForm({
  //     allowMethods: selectedResource.cors.allowMethods.map((method) => method),
  //     allowHeaders: selectedResource.cors.allowHeaders.map((header) => header),
  //     allowOrigin: '',
  //     exposeHeaders: selectedResource.cors.exposeHeaders.map((header) => header),
  //     maxAge: selectedResource.cors.maxAge,
  //     allowCredentials: selectedResource.cors?.allowCredentials,
  //   });
  // }, [selectedResource]);

  const { mutate: modifyCORSMutate } = useModifyResourceCorsSettings({
    onSuccess: () => {
      toast.success('리소스의 CORS 설정이 변경되었습니다.');
      onOpenChange(false);
    },
  });

  // const modifyCORSSettings = () => {
  //   modifyCORSMutate({
  //     resourceId: resourceId,
  //     enableCors: selectedResource.corsEnabled,
  //     data: {
  //       allowedOrigins: selectedResource.cors.allowOrigins,
  //       allowedHeaders: selectedResource.cors.allowHeaders,
  //       exposedHeaders: selectedResource.cors.exposeHeaders,
  //       maxAge: selectedResource.cors.maxAge,
  //       allowCredentials: selectedResource.cors.allowCredentials,
  //     },
  //   });
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-scroll-y">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            CORS 활성화 설정
          </DialogTitle>
        </DialogHeader>

        {selectedResource?.cors && (
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">CORS 설정</h4>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Allow-Methods
                </Label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={'Method_OPTIONS'}
                      // checked={false}
                      // onCheckedChange={(checked) => handleSaveId(checked as boolean)}
                      className="bg-white border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={'Method_OPTIONS'}
                      className="text-sm text-gray-600 cursor-pointer">
                      OPTIONS
                    </Label>
                  </div>
                  {/* 리소스에서 생성한 메서드 종류가 체크박스 옵션으로 나와야함 */}
                  {corsForm.allowMethods.map((method: string) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={method}
                        // checked={false}
                        // onCheckedChange={(checked) => handleSaveId(checked as boolean)}
                        className="bg-white border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={method} className="text-sm text-gray-600 cursor-pointer">
                        {method.toUpperCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Allow-Headers
                </Label>
                <Input
                  value={corsForm.allowHeaders}
                  onChange={(e) => setCorsForm({ ...corsForm, allowHeaders: e.target.value })}
                  placeholder="content-type,x-ncp-apigw-api-key,x-ncp-apigw-timestamp"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Allow-Origin
                </Label>
                <Input
                  value={corsForm.allowOrigin}
                  onChange={(e) => setCorsForm({ ...corsForm, allowOrigin: e.target.value })}
                  placeholder="*"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Expose-Headers
                </Label>
                <Input
                  value={corsForm.exposeHeaders}
                  onChange={(e) => setCorsForm({ ...corsForm, exposeHeaders: e.target.value })}
                  placeholder="헤더 이름들을 쉼표로 구분"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Max-Age
                </Label>
                <Input
                  value={corsForm.maxAge}
                  onChange={(e) => setCorsForm({ ...corsForm, maxAge: e.target.value })}
                  placeholder="86400"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access-Control-Allow-Credentials
                </Label>
                <Switch
                  checked={corsForm.allowCredentials}
                  onCheckedChange={(checked) =>
                    setCorsForm({ ...corsForm, allowCredentials: checked })
                  }
                />
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          {/* <Button onClick={modifyCORSSettings} className="bg-blue-500 hover:bg-blue-600 text-white">
            저장
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
