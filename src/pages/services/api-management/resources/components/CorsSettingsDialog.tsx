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
import type { Resource } from '@/types/resource';
import type { CorsForm } from '../hooks/useCorsSettingsDialog';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

interface CorsSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedResource: Resource;
  corsForm: CorsForm;
  checkedMethod: string[];
  isPending?: boolean;
  onSaveCorsSettings: () => void;
  onMethodToggle: (methodType: string, checked: boolean) => void;
  onCommaSeparatedInputChange: (
    value: string,
    key: 'allowHeaders' | 'allowOrigins' | 'exposeHeaders'
  ) => void;
  onMaxAgeChange: (value: string) => void;
  onAllowCredentialsChange: (checked: boolean) => void;
  onCorsEnabledChange: (checked: boolean) => void;
}

export function CorsSettingsDialog({
  open,
  onOpenChange,
  selectedResource,
  corsForm,
  checkedMethod,
  isPending,
  onSaveCorsSettings,
  onMethodToggle,
  onCommaSeparatedInputChange,
  onMaxAgeChange,
  onAllowCredentialsChange,
  onCorsEnabledChange
}: CorsSettingsDialogProps) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 flex items-center space-x-2 gap-2 mb-2">
            CORS Enable Setting
            <Switch
              checked={corsForm.corsEnabled}
              onCheckedChange={onCorsEnabledChange}
            />
          </DialogTitle>
        </DialogHeader>
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-4">
          {/* <h4 className="font-medium text-blue-900 dark:text-blue-100">CORS 설정</h4> */}
          <div className="space-y-4">
            {(corsForm.corsEnabled || (corsForm.allowMethods?.length ?? 0) > 0) &&
              <div>
                <Label className={`text-sm font-medium mb-2 block ${corsForm?.corsEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-300'}`}>
                  Access-Control-Allow-Methods <span className='text-red-500'>*</span>
                </Label>
                <div className="space-y-1">
                  {corsForm?.allowMethods?.map((method, i) => (
                    <div className="flex items-center space-x-2" key={i}>
                      <CheckboxPrimitive.Root
                        id={method}
                        checked={checkedMethod?.includes(method)}
                        disabled={!corsForm?.corsEnabled}
                        onCheckedChange={(checked) => onMethodToggle(method, checked as boolean)}
                        className="w-5 h-5 border border-gray-300 bg-white rounded
                        data-[state=checked]:bg-blue-600
                        data-[state=checked]:border-blue-600
                        data-[disabled]:cursor-not-allowed
                        data-[disabled]:border-gray-200
                        flex items-center justify-center transition-colors"
                      >
                        <CheckboxPrimitive.Indicator>
                          <Check className="w-4 h-4 text-white" />
                        </CheckboxPrimitive.Indicator>
                      </CheckboxPrimitive.Root>

                      <Label htmlFor={method} className={`text-sm text-gray-600 cursor-pointer ${corsForm?.corsEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-300'}`}>
                        {method?.toUpperCase()}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            }
            <div>
              <Label className={`text-sm font-medium ${corsForm?.corsEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-300'} mb-2 block`}>
                Access-Control-Allow-Origin <span className='text-red-500'>*</span>
              </Label>
              <Input
                value={corsForm?.allowOrigins?.join(', ')}
                onChange={(e) => onCommaSeparatedInputChange(e.target.value, 'allowOrigins')}
                placeholder={corsForm?.allowOrigins?.join(',')}
                disabled={!corsForm?.corsEnabled}
              />
            </div>
            <div>
              <Label className={`text-sm font-medium ${corsForm?.corsEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-300'} mb-2 block`}>
                Access-Control-Allow-Headers
              </Label>
              <Input
                value={corsForm?.allowHeaders?.join(', ')}
                onChange={(e) => onCommaSeparatedInputChange(e.target.value, 'allowHeaders')}
                placeholder={corsForm?.allowHeaders?.join(',')}
                disabled={!corsForm?.corsEnabled}
              />
            </div>


            <div>
              <Label className={`text-sm font-medium ${corsForm?.corsEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-300'} mb-2 block`}>
                Access-Control-Expose-Headers
              </Label>
              <Input
                value={corsForm?.exposeHeaders?.join(', ')}
                onChange={(e) => onCommaSeparatedInputChange(e.target.value, 'exposeHeaders')}
                placeholder={corsForm?.exposeHeaders?.join(',')}
                disabled={!corsForm?.corsEnabled}
              />
            </div>
            <div>
              <Label className={`text-sm font-medium ${corsForm?.corsEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-300'} mb-2 block`}>
                Access-Control-Max-Age
              </Label>
              <Input
                value={corsForm.maxAge}
                onChange={(e) => onMaxAgeChange(e.target.value)}
                placeholder="86400"
                disabled={!corsForm?.corsEnabled}
              />
            </div>
            <div className="flex items-center space-x-2">
              <CheckboxPrimitive.Root
                id="allowCredentials"
                checked={corsForm.corsEnabled ? corsForm.allowCredentials : false}
                disabled={!corsForm.corsEnabled}
                onCheckedChange={onAllowCredentialsChange}
                className="w-5 h-5 border border-gray-300 bg-white rounded
             data-[state=checked]:bg-blue-600
             data-[state=checked]:border-blue-600
             flex items-center justify-center">
                <CheckboxPrimitive.Indicator>
                  <Check className="w-4 h-4 text-white" />
                </CheckboxPrimitive.Indicator>
              </CheckboxPrimitive.Root>

              <Label className={`cursor-pointer text-sm font-medium ${corsForm?.corsEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-300'}`}
                htmlFor='allowCredentials'
              >
                Access-Control-Allow-Credentials
              </Label>

            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSaveCorsSettings}
            disabled={isPending || (corsForm?.corsEnabled && checkedMethod?.length === 0)}
            className="bg-blue-500 hover:bg-blue-600 text-white">
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
