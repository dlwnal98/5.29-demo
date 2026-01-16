import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MethodFormData, IntegrationTypeOption } from '../hooks/useMethodEditForm';
import { Globe, Server, Cloud, Zap } from 'lucide-react';
import { Method } from '@/types/resource';

interface BasicInfoEditTabProps {
  formData: MethodFormData;
  integrationTypeList: IntegrationTypeOption[];
  onChange: (updates: Partial<MethodFormData>) => void;
  selectedMethod: Method;
}

export function BasicInfoEditTab({ formData, integrationTypeList, onChange, selectedMethod }: BasicInfoEditTabProps) {
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
        return '백엔드 HTTP 엔드포인트로 요청을 프록시합니다.';
      case 'MOCK':
        return '실제 백엔드 없이 Mock 응답을 반환합니다.';
      case 'AWS':
        return 'AWS 서비스와 직접 통합합니다.';
      case 'AWS_PROXY':
        return 'AWS Lambda 함수로 요청을 프록시합니다.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="!text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>메서드 ID</Label>
            <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded text-gray-600">
              {methodInfo?.['x-method-id'] || '-'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">메서드 요약 <span className="text-red-500">*</span></Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => onChange({ summary: e.target.value })}
              placeholder="메서드에 대한 간단한 요약을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">메서드 설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="메서드에 대한 상세 설명을 입력하세요"
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
                <div className="text-sm font-mono bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded text-gray-600 break-all">
                  {methodInfo?.['x-route-endpoint'] ?? ''}{selectedMethod.resourcePath}
                </div>
                <p className="text-xs text-gray-500">API Gateway 엔드포인트 URL (읽기 전용)</p>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="routingEndpoint">백엔드 서비스 URL <span className="text-red-500">*</span></Label>
                <Input
                  id="routingEndpoint"
                  value={formData.routingEndpoint}
                  onChange={(e) => onChange({ routingEndpoint: e.target.value })}
                  placeholder="https://api.example.com/endpoint"
                />
                <p className="text-xs text-gray-500">
                  요청이 전달될 백엔드 서비스의 URL을 입력하세요.
                </p>
              </div>
            </>
          )}

          {formData.integrationType === 'MOCK' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Mock 통합은 실제 백엔드 없이 미리 정의된 응답을 반환합니다. 응답 설정 탭에서 Mock 응답을 구성하세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
