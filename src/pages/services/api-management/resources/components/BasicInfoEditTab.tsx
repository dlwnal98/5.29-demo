import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MethodFormData, IntegrationTypeOption } from '../hooks/useMethodEditForm';
import { Globe, Server, Cloud, Zap, HelpCircle } from 'lucide-react';
import { Method } from '@/types/resource';
import { EndpointsData } from '@/apis/route-endpoints.api';

interface BasicInfoEditTabProps {
  formData: MethodFormData;
  integrationTypeList: IntegrationTypeOption[];
  onChange: (updates: Partial<MethodFormData>) => void;
  selectedMethod: Method;
  endpointList: EndpointsData[];
}

export function BasicInfoEditTab({ formData, integrationTypeList, onChange, selectedMethod, endpointList }: BasicInfoEditTabProps) {
  const methodInfo = selectedMethod?.info as any;
  const getIntegrationIcon = (code: string) => {
    switch (code) {
      case 'HTTP':
        return <Globe className="h-4 w-4" />;
      case 'MOCK':
        return <Server className="h-4 w-4" />;
      case 'AWS':
        return <Cloud className="h-4 w-4" />;
      case 'AWS_PROXY':
        return <Zap className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getIntegrationDescription = (code: string) => {
    switch (code) {
      case 'HTTP':
        return 'Proxy the request to the backend HTTP endpoint.';
      case 'MOCK':
        return 'Return a mock response without a backend.';
      case 'AWS':
        return 'Integrate with AWS services directly.';
      case 'AWS_PROXY':
        return 'Proxy the request to AWS Lambda function.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="!text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Method ID</Label>
            <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded text-gray-600">
              {methodInfo?.['x-method-id'] || '-'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Method Summary <span className="text-red-500">*</span></Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => onChange({ summary: e.target.value })}
              placeholder="Enter a brief summary of the method"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Method Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Enter a detailed description of the method"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="!text-lg">Integration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Integration Type <span className="text-red-500">*</span></Label>
            <RadioGroup
              value={formData.integrationType}
              onValueChange={(value) => onChange({ integrationType: value })}
              className="grid grid-cols-1 gap-3"
            >
              {integrationTypeList.map((type) => (
                <label
                  key={type.code}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.integrationType === type.code
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}
                >
                  <RadioGroupItem value={type.code} id={type.code} className="mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getIntegrationIcon(type.code)}
                      <span className="font-medium">{type.description}</span>
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {type.code}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{getIntegrationDescription(type.code)}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {formData.integrationType === 'HTTP' && (
            <>
              <div className="space-y-2 mt-4">
                <Label>URL</Label>
                <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded text-gray-600 break-all">
                  {methodInfo?.['x-route-endpoint'] ?? ''}{selectedMethod.resourcePath}
                </div>
                <p className="text-xs text-gray-500">API Gateway endpoint URL (Read-only)</p>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <Label htmlFor="routingEndpoint">
                    Backend Service URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-600">Direct Input</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="relative top-[-10px] left-[60px] w-80 p-3 bg-slate-900 text-slate-50 shadow-xl border-none">
                          <div className="space-y-2 text-xs leading-relaxed">
                            <p className="font-semibold text-blue-400 border-b border-slate-700 pb-1 mb-2">
                              Direct Input 가이드
                            </p>
                            <div className="flex gap-2">
                              <span className="text-blue-400">•</span>
                              <p>
                                <strong>활성화 시:</strong> Routing Endpoint를 수정 없이 그대로 백엔드에 전달합니다.
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-blue-400">•</span>
                              <p>
                                <strong>비활성화 시:</strong> Routing Endpoint와 리소스 경로가 자동으로 조합되어 적용됩니다.
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Switch
                      checked={formData.isDirectUrlInput}
                      onCheckedChange={(checked) => onChange({
                        isDirectUrlInput: checked,
                        routingMode: checked ? 'DIRECT' : 'PATH_APPEND'
                      })}
                    />
                  </div>
                </div>

                {formData.isDirectUrlInput ? (
                  <Input
                    id="routingEndpoint"
                    value={formData.routingEndpoint}
                    onChange={(e) => onChange({ routingEndpoint: e.target.value })}
                    placeholder="https://api.example.com/endpoint"
                  />
                ) : (
                  <Select
                    value={formData.selectedEndpointUrl || formData.routingEndpoint}
                    onValueChange={(value) => onChange({
                      selectedEndpointUrl: value,
                      routingEndpoint: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        endpointList?.length > 0
                          ? "Select an Endpoint URL"
                          : "No endpoint URLs available."
                      } />
                    </SelectTrigger>
                    {endpointList?.length > 0 && (
                      <SelectContent>
                        {endpointList?.map((endpoint) => (
                          <SelectItem key={endpoint.id} value={endpoint.routeUrl} className="hover:cursor-pointer">
                            {endpoint.routeUrl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
                )}

                <p className="text-xs text-gray-500">
                  Enter the URL of the backend service to which the request will be forwarded.
                </p>
              </div>
            </>
          )}

          {formData.integrationType === 'MOCK' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Mock integration returns a pre-defined response without a backend. Configure the Mock response in the Response Settings tab.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
