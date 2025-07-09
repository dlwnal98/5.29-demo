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
import { X, Globe } from 'lucide-react';
import type { CorsSettings } from '@/types/resource';

interface CorsSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  corsForm: CorsSettings;
  setCorsForm: (form: CorsSettings) => void;
  handleCorsUpdate: () => void;
  httpMethods: string[];
  addCorsMethod: (method: string) => void;
  removeCorsMethod: (method: string) => void;
}

export function CorsSettingsDialog({
  open,
  onOpenChange,
  corsForm,
  setCorsForm,
  handleCorsUpdate,
  httpMethods,
  addCorsMethod,
  removeCorsMethod,
}: CorsSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            CORS 설정
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Access-Control-Allow-Method */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Access-Control-Allow-Method
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {corsForm.allowMethods.map((method) => (
                <Badge
                  key={method}
                  className={`$ {
                    method === 'GET'
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : method === 'POST'
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                        : method === 'HEAD'
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  } cursor-pointer`}
                  onClick={() => removeCorsMethod(method)}
                >
                  {method}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <Select onValueChange={addCorsMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="메서드 추가" />
              </SelectTrigger>
              <SelectContent>
                {httpMethods
                  .filter((method) => !corsForm.allowMethods.includes(method))
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
              value={corsForm.allowHeaders}
              onChange={(e) => setCorsForm({ ...corsForm, allowHeaders: e.target.value })}
              placeholder="content-type,x-ncp-apigw-api-key,x-ncp-apigw-timestamp"
            />
          </div>
          {/* Access-Control-Allow-Origin */}
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
          {/* Access-Control-Expose-Headers */}
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
          {/* Access-Control-Max-Age */}
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
          {/* Access-Control-Allow-Credentials */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Access-Control-Allow-Credentials
            </Label>
            <Switch
              checked={corsForm.allowCredentials}
              onCheckedChange={(checked) => setCorsForm({ ...corsForm, allowCredentials: checked })}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleCorsUpdate} className="bg-blue-500 hover:bg-blue-600 text-white">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
