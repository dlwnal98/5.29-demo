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
import { Globe, Check } from 'lucide-react';
import type { Method, Resource } from '@/types/resource';
import { useModifyResourceCorsSettings } from '@/hooks/use-resources';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

interface CorsSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceId: string;
  userKey: string;
  selectedResource: Resource;
  setSelectedResource: (resource: Resource) => void;
}

export function CorsSettingsDialog({
  open,
  onOpenChange,
  resourceId,
  selectedResource,
  userKey,
  setSelectedResource,
}: CorsSettingsDialogProps) {
  const [corsForm, setCorsForm] = useState({
    allowMethods: [],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowOrigins: ['*'],
    exposeHeaders: ['X-Total-Count', 'X-Request-Id'],
    maxAge: 3600,
    allowCredentials: true,
  });
  const [selectedMethods, setSelectedMethods] = useState<any[]>([]);

  console.log(selectedResource);
  useEffect(() => {
    if (!selectedResource?.cors) return;

    const cors = selectedResource.cors;

    setCorsForm({
      allowMethods: Array.isArray(cors.allowMethods)
        ? cors.allowMethods
        : cors.allowMethods
          ? cors.allowMethods.split(',').map((s) => s.trim())
          : [],
      allowHeaders: Array.isArray(cors.allowHeaders)
        ? cors.allowHeaders
        : cors.allowHeaders
          ? cors.allowHeaders.split(',').map((s) => s.trim())
          : [],
      allowOrigins: Array.isArray(cors.allowOrigins)
        ? cors.allowOrigins
        : cors.allowOrigins
          ? cors.allowOrigins.split(',').map((s) => s.trim())
          : [],
      exposeHeaders: Array.isArray(cors.exposeHeaders)
        ? cors.exposeHeaders
        : cors.exposeHeaders
          ? cors.exposeHeaders.split(',').map((s) => s.trim())
          : [],
      maxAge: cors.maxAge ?? 3600,
      allowCredentials: cors.allowCredentials ?? true,
    });
  }, [selectedResource]);

  const { mutate: modifyCORSMutate } = useModifyResourceCorsSettings({
    onSuccess: () => {
      toast.success('리소스의 CORS 설정이 변경되었습니다.');
      onOpenChange(false);
    },
  });

  const modifyCORSSettings = () => {
    modifyCORSMutate({
      resourceId: resourceId,
      data: {
        allowedOrigins: corsForm.allowOrigins,
        allowedHeaders: corsForm.allowHeaders,
        allowedMethods: corsForm.allowMethods,
        exposedHeaders: corsForm.exposeHeaders,
        maxAge: corsForm.maxAge,
        allowCredentials: corsForm.allowCredentials,
        updatedBy: userKey,
      },
    });
  };
  console.log(selectedResource?.methods);
  const handleCheckedChange = (method: Method, checked: boolean) => {
    setCorsForm((prev) => {
      const prevMethods = prev.allowMethods || [];
      if (checked) {
        // 이미 포함되어 있지 않으면 추가
        if (!prevMethods.includes(method.type)) {
          return { ...prev, allowMethods: [...prevMethods, method.type] };
        }
        return prev;
      } else {
        // 체크 해제 시 제거
        return { ...prev, allowMethods: prevMethods.filter((m) => m !== method.type) };
      }
    });
  };

  console.log(corsForm);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-scroll-y">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-2">
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
                  {/* 리소스에서 생성한 메서드 종류가 체크박스 옵션으로 나와야함 */}
                  {selectedResource?.methods?.map((method: Method) => (
                    <div className="flex items-center space-x-2" key={method.id}>
                      <CheckboxPrimitive.Root
                        id={method.type}
                        checked={corsForm?.allowMethods?.includes(method.type)}
                        onCheckedChange={(checked) => handleCheckedChange(method, checked === true)}
                        className="w-5 h-5 border border-gray-300 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 flex items-center justify-center">
                        <CheckboxPrimitive.Indicator>
                          <Check className="w-4 h-4 text-white" />
                        </CheckboxPrimitive.Indicator>
                      </CheckboxPrimitive.Root>

                      <Label htmlFor={method.type} className="text-sm text-gray-600 cursor-pointer">
                        {method.type.toUpperCase()}
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
                  onChange={(e) =>
                    setCorsForm({
                      ...corsForm,
                      allowHeaders: e.target.value
                        .split(',') // 쉼표로 문자열 분리
                        .map((s) => s.trim()) // 앞뒤 공백 제거
                        .filter((s) => s), // 빈 문자열 제거
                    })
                  }
                  placeholder={corsForm.allowHeaders.join(',')}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Allow-Origin
                </Label>
                <Input
                  value={corsForm.allowOrigins}
                  onChange={(e) =>
                    setCorsForm({
                      ...corsForm,
                      allowOrigins: e.target.value
                        .split(',') // 쉼표로 문자열 분리
                        .map((s) => s.trim()) // 앞뒤 공백 제거
                        .filter((s) => s), // 빈 문자열 제거
                    })
                  }
                  placeholder={corsForm.allowOrigins.join(',')}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Expose-Headers
                </Label>
                <Input
                  value={corsForm.exposeHeaders}
                  onChange={(e) =>
                    setCorsForm({
                      ...corsForm,
                      exposeHeaders: e.target.value
                        .split(',') // 쉼표로 문자열 분리
                        .map((s) => s.trim()) // 앞뒤 공백 제거
                        .filter((s) => s), // 빈 문자열 제거
                    })
                  }
                  placeholder={corsForm.exposeHeaders.join(',')}
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
          <Button onClick={modifyCORSSettings} className="bg-blue-500 hover:bg-blue-600 text-white">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
