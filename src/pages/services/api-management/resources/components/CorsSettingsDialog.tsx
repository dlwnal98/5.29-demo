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
import { Check } from 'lucide-react';
import type { Method, Resource } from '@/types/resource';
import type { CorsForm } from '../hooks/useCorsSettingsDialog';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

interface CorsSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedResource: Resource;
  corsForm: CorsForm;
  isPending?: boolean;
  onSaveCorsSettings: () => void;
  onMethodToggle: (methodType: string, checked: boolean) => void;
  onCommaSeparatedInputChange: (
    value: string,
    key: 'allowHeaders' | 'allowOrigins' | 'exposeHeaders'
  ) => void;
  onMaxAgeChange: (value: string) => void;
  onAllowCredentialsChange: (checked: boolean) => void;
}

export function CorsSettingsDialog({
  open,
  onOpenChange,
  selectedResource,
  corsForm,
  isPending,
  onSaveCorsSettings,
  onMethodToggle,
  onCommaSeparatedInputChange,
  onMaxAgeChange,
  onAllowCredentialsChange,
}: CorsSettingsDialogProps) {
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
                  {selectedResource?.methods?.map((method: Method) => (
                    <div className="flex items-center space-x-2" key={method.id}>
                      <CheckboxPrimitive.Root
                        id={method.type}
                        checked={corsForm.allowMethods.includes(method.type)}
                        onCheckedChange={(checked) =>
                          onMethodToggle(method.type, checked as boolean)
                        }
                        className="w-5 h-5 border border-gray-300 bg-white rounded
             data-[state=checked]:bg-blue-600
             data-[state=checked]:border-blue-600
             flex items-center justify-center">
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
                  value={corsForm.allowHeaders.join(', ')}
                  onChange={(e) => onCommaSeparatedInputChange(e.target.value, 'allowHeaders')}
                  placeholder={corsForm.allowHeaders.join(',')}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Allow-Origin
                </Label>
                <Input
                  value={corsForm.allowOrigins.join(', ')}
                  onChange={(e) => onCommaSeparatedInputChange(e.target.value, 'allowOrigins')}
                  placeholder={corsForm.allowOrigins.join(',')}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Expose-Headers
                </Label>
                <Input
                  value={corsForm.exposeHeaders.join(', ')}
                  onChange={(e) => onCommaSeparatedInputChange(e.target.value, 'exposeHeaders')}
                  placeholder={corsForm.exposeHeaders.join(',')}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Access-Control-Max-Age
                </Label>
                <Input
                  value={corsForm.maxAge}
                  onChange={(e) => onMaxAgeChange(e.target.value)}
                  placeholder="86400"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access-Control-Allow-Credentials
                </Label>
                <Switch
                  checked={corsForm.allowCredentials}
                  onCheckedChange={onAllowCredentialsChange}
                />
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={onSaveCorsSettings}
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white">
            {isPending ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
