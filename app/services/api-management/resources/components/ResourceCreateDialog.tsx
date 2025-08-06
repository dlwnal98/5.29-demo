import React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { CorsSettings } from '@/types/resource';

interface ResourceCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createResourceForm: {
    path: string;
    name: string;
    corsEnabled: boolean;
    corsSettings: CorsSettings;
  };
  setCreateResourceForm: (form: any) => void;
  handleCreateResource: () => void;
  availableResourcePaths: string[];
  httpMethods: string[];
}

export function ResourceCreateDialog({
  open,
  onOpenChange,
  createResourceForm,
  setCreateResourceForm,
  handleCreateResource,
  availableResourcePaths,
  httpMethods,
}: ResourceCreateDialogProps) {
  const addCreateFormCorsMethod = (method: string) => {
    if (!createResourceForm.corsSettings.allowMethods.includes(method)) {
      setCreateResourceForm({
        ...createResourceForm,
        corsSettings: {
          ...createResourceForm.corsSettings,
          allowMethods: [...createResourceForm.corsSettings.allowMethods, method],
        },
      });
    }
  };

  const removeCreateFormCorsMethod = (method: string) => {
    setCreateResourceForm({
      ...createResourceForm,
      corsSettings: {
        ...createResourceForm.corsSettings,
        allowMethods: createResourceForm.corsSettings.allowMethods.filter((m) => m !== method),
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">Resource 생성</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Resource Path and Name - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="resource-path"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                리소스 경로
              </Label>
              <Select
                value={createResourceForm.path}
                onValueChange={(value) =>
                  setCreateResourceForm({ ...createResourceForm, path: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="경로를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {availableResourcePaths.map((path) => (
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
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                리소스 이름
              </Label>
              <Input
                id="resource-name"
                placeholder="my-resource"
                value={createResourceForm.name}
                onChange={(e) =>
                  setCreateResourceForm({ ...createResourceForm, name: e.target.value })
                }
              />
            </div>
          </div>
          {/* CORS Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <Label
                htmlFor="cors-toggle"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                원본에서 CORS
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Cross-Origin Resource Sharing을 활성화합니다
              </p>
            </div>
            <Switch
              id="cors-toggle"
              checked={createResourceForm.corsEnabled}
              onCheckedChange={(checked) =>
                setCreateResourceForm({ ...createResourceForm, corsEnabled: checked })
              }
            />
          </div>
          {/* CORS Settings - Only show when CORS is enabled */}
          {createResourceForm.corsEnabled && (
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">CORS 설정</h4>
              {/* Access-Control-Allow-Method */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Allow-Method
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {createResourceForm.corsSettings.allowMethods.map((method) => (
                    <Badge
                      key={method}
                      className={`${
                        method === 'GET'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : method === 'POST'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                            : method === 'HEAD'
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      } cursor-pointer`}
                      onClick={() => removeCreateFormCorsMethod(method)}
                    >
                      {method}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={addCreateFormCorsMethod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="메서드 추가" />
                  </SelectTrigger>
                  <SelectContent>
                    {httpMethods
                      .filter(
                        (method) => !createResourceForm.corsSettings.allowMethods.includes(method)
                      )
                      .map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Access-Control-Allow-Headers */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Allow-Headers
                </Label>
                <Input
                  value={createResourceForm.corsSettings.allowHeaders}
                  onChange={(e) =>
                    setCreateResourceForm({
                      ...createResourceForm,
                      corsSettings: {
                        ...createResourceForm.corsSettings,
                        allowHeaders: e.target.value,
                      },
                    })
                  }
                  placeholder="content-type,x-ncp-apigw-api-key,x-ncp-apigw-timestamp"
                />
              </div>
              {/* Access-Control-Allow-Origin */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Allow-Origin
                </Label>
                <Input
                  value={createResourceForm.corsSettings.allowOrigin}
                  onChange={(e) =>
                    setCreateResourceForm({
                      ...createResourceForm,
                      corsSettings: {
                        ...createResourceForm.corsSettings,
                        allowOrigin: e.target.value,
                      },
                    })
                  }
                  placeholder="*"
                />
              </div>
              {/* Access-Control-Expose-Headers */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Expose-Headers
                </Label>
                <Input
                  value={createResourceForm.corsSettings.exposeHeaders}
                  onChange={(e) =>
                    setCreateResourceForm({
                      ...createResourceForm,
                      corsSettings: {
                        ...createResourceForm.corsSettings,
                        exposeHeaders: e.target.value,
                      },
                    })
                  }
                  placeholder="헤더 이름들을 쉼표로 구분"
                />
              </div>
              {/* Access-Control-Max-Age */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Max-Age
                </Label>
                <Input
                  value={createResourceForm.corsSettings.maxAge}
                  onChange={(e) =>
                    setCreateResourceForm({
                      ...createResourceForm,
                      corsSettings: {
                        ...createResourceForm.corsSettings,
                        maxAge: e.target.value,
                      },
                    })
                  }
                  placeholder="86400"
                />
              </div>
              {/* Access-Control-Allow-Credentials */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access-Control-Allow-Credentials
                </Label>
                <Switch
                  checked={createResourceForm.corsSettings.allowCredentials}
                  onCheckedChange={(checked) =>
                    setCreateResourceForm({
                      ...createResourceForm,
                      corsSettings: {
                        ...createResourceForm.corsSettings,
                        allowCredentials: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setCreateResourceForm({
                path: '',
                name: '',
                corsEnabled: false,
                corsSettings: {
                  allowMethods: [],
                  allowHeaders: '',
                  allowOrigin: '*',
                  exposeHeaders: '',
                  maxAge: '',
                  allowCredentials: false,
                },
              });
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleCreateResource}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
