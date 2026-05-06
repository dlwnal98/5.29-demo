import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MethodFormData, IntegrationTypeOption } from '../hooks/useMethodEditForm';
import { Globe, Server, Cloud, Zap, HelpCircle, ChevronDown } from 'lucide-react';
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

  // 초기 상태 값 계산 (컴포넌트 로드 시점의 DB 값)
  const initialIsDirectUrlInput = useMemo(() => !(methodInfo?.['x-append-path'] ?? true), [methodInfo]);
  const initialEndpoints = useMemo(() => {
    const endpoints = methodInfo?.['x-route-endpoints'];
    if (Array.isArray(endpoints)) return [...endpoints];
    const single = methodInfo?.['x-route-endpoint'];
    if (single) return [single];
    return initialIsDirectUrlInput ? [""] : [];
  }, [methodInfo, initialIsDirectUrlInput]);

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
        return 'Backend HTTP 엔드포인트로 요청을 프록시합니다.';
      case 'MOCK':
        return '백엔드 없이 모크 응답을 반환합니다.';
      case 'AWS':
        return 'AWS 서비스와 직접 통합합니다.';
      case 'AWS_PROXY':
        return 'AWS Lambda 함수로 요청을 프록시합니다.';
      default:
        return '';
    }
  };

  console.log(formData)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="!text-lg">Method 기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>ID</Label>
            <div className="w-full lg:w-2/3 text-sm font-mono bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded text-gray-600">
              {methodInfo?.['x-method-id'] || '-'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">요약 <span className="text-red-500">*</span></Label>
            <Input
              id="summary"
              className='w-full lg:w-2/3'
              value={formData.summary}
              onChange={(e) => onChange({ summary: e.target.value })}
              placeholder="요약을 입력해주세요."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              className='w-full lg:w-2/3'
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="설명을 입력해주세요."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="!text-lg">통합 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>통합 유형 <span className="text-red-500">*</span></Label>
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
                <p className="text-xs text-gray-500">API Gateway endpoint URL (읽기 전용)</p>
                {methodInfo?.['x-route-endpoints'] ? (
                  methodInfo?.['x-route-endpoints'].map((endpoint: string, i: number) => (
                    <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded text-gray-600 break-all">
                      {endpoint ?? ''}{selectedMethod.resourcePath}
                    </div>
                  ))
                ) : (
                  <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded text-gray-600 break-all">
                    {methodInfo?.['x-route-endpoint'] ?? ''}{selectedMethod.resourcePath}
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-3 mb-1">
                  <Label htmlFor="routingEndpoint">
                    Routing Endpoint URL <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-600">직접 입력</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="relative top-[-10px] left-[60px] w-80 p-3 bg-slate-900 text-slate-50 shadow-xl border-none">
                          <div className="space-y-2 text-xs leading-relaxed">
                            <p className="font-semibold text-blue-400 border-b border-slate-700 pb-1 mb-2">
                              직접 입력 가이드
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
                      onCheckedChange={(checked) => {
                        const isBackToInitial = checked === initialIsDirectUrlInput;
                        const nextEndpoints = isBackToInitial ? initialEndpoints : (checked ? [""] : []);
                        onChange({
                          isDirectUrlInput: checked,
                          routingMode: checked ? 'DIRECT' : 'PATH_APPEND',
                          routingEndpoint: nextEndpoints,
                          selectedEndpointUrl: checked ? [] : nextEndpoints
                        });
                      }}
                    />
                  </div>
                </div>
                <p className="text-red-500 text-xs mb-2">* URL이 2개 이상일 경우 로드밸런싱이 적용됩니다.</p>

                {formData.isDirectUrlInput ? (
                  <div className="space-y-3 w-full lg:w-2/3">
                    {formData.routingEndpoint.map((url, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          className="flex-1"
                          value={url}
                          onChange={(e) => {
                            const newArr = [...formData.routingEndpoint];
                            newArr[index] = e.target.value;
                            onChange({ routingEndpoint: newArr });
                          }}
                          placeholder="https://api.example.com/endpoint"
                        />
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 shrink-0 text-gray-500"
                            onClick={() => {
                              onChange({ routingEndpoint: [...formData.routingEndpoint, ""] });
                            }}
                          >
                            ＋
                          </Button>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 shrink-0 text-gray-500"
                              onClick={() => {
                                onChange({ routingEndpoint: formData.routingEndpoint.filter((_, i) => i !== index) });
                              }}
                            >
                              －
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full lg:w-2/3 justify-between font-normal hover:bg-transparent"
                        >
                          <span className="truncate">
                            {formData.routingEndpoint?.length > 0
                              ? formData.routingEndpoint.join(", ")
                              : endpointList?.length > 0
                                ? "Endpoint URL을 선택해주세요."
                                : "Endpoint URL이 없습니다."}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                        </Button>
                      </PopoverTrigger>
                      {endpointList?.length > 0 && (
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0"
                          align="start"
                        >
                          <ScrollArea className="max-h-60">
                            <div className="p-1">
                              {endpointList?.map((endpoint) => {
                                const checked = formData.routingEndpoint?.includes(endpoint.routeUrl);
                                return (
                                  <div
                                    key={endpoint.id}
                                    className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let newArr = [...(formData.routingEndpoint || [])];
                                      if (checked) {
                                        newArr = newArr.filter((item) => item !== endpoint.routeUrl);
                                      } else {
                                        newArr.push(endpoint.routeUrl);
                                      }
                                      onChange({
                                        routingEndpoint: newArr,
                                        selectedEndpointUrl: newArr
                                      });
                                    }}
                                  >
                                    <Checkbox checked={checked} className="!rounded pointer-events-none" />
                                    <span className="text-sm truncate">{endpoint.routeUrl}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      )}
                    </Popover>
                  </div>
                )}


              </div>
            </>
          )}

          {formData.integrationType === 'MOCK' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Mock 통합은 백엔드 없이 미리 정의된 응답을 반환합니다. Mock 응답을 [응답설정] 탭에서 구성합니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
