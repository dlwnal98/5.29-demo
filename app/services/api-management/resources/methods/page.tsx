'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Globe,
  Box,
  Plus,
  Trash2,
  AlertCircle,
  Key,
  CheckCircle,
  Settings,
  Code,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  QueryParameter,
  Header,
  FormData,
  BodyModel,
  MockHeader,
  ApiKey,
  Model,
} from '@/types/methods';

export default function CreateMethodPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resourceId = searchParams.get('resourceId');
  const resourcePath = searchParams.get('resourcePath');

  const [methodForm, setMethodForm] = useState({
    methodType: '',
    integrationType: 'http',
    // HTTP Integration
    httpProxyIntegration: true,
    endpointUrl: '',
    customEndpointUrl: '',
    additionalParameter: '',
    // Common
    authorization: '없음',
    requestValidator: '없음',
    apiKeyRequired: false,
    selectedApiKey: '',
    operationName: 'GetPets',
  });

  const [mockHeaders, setMockHeaders] = useState<MockHeader[]>([{ id: '1', name: '', value: '' }]);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      description: '프로덕션 환경용 API 키',
      value: 'prod-api-key-123',
    },
    {
      id: '2',
      name: 'Development API Key',
      description: '개발 환경용 API 키',
      value: 'dev-api-key-456',
    },
    {
      id: '3',
      name: 'Test API Key',
      description: '테스트 환경용 API 키',
      value: 'test-api-key-789',
    },
  ]);

  const [models, setModels] = useState<Model[]>([
    {
      id: '1',
      name: 'User',
      description: '사용자 정보 모델',
      schema: `{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "사용자 ID"
    },
    "name": {
      "type": "string",
      "description": "사용자 이름"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "이메일 주소"
    }
  },
  "required": ["id", "name", "email"]
}`,
    },
    {
      id: '2',
      name: 'Product',
      description: '상품 정보 모델',
      schema: `{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "상품 ID"
    },
    "name": {
      "type": "string",
      "description": "상품명"
    },
    "price": {
      "type": "number",
      "minimum": 0,
      "description": "가격"
    }
  },
  "required": ["id", "name", "price"]
}`,
    },
  ]);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isDirectUrlInput, setIsDirectUrlInput] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState('');
  const [isCreatingNewApiKey, setIsCreatingNewApiKey] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState({
    name: '',
    description: '',
  });

  const [newModelForm, setNewModelForm] = useState({
    name: '',
    description: '',
    schema: `{
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": [
    "firstName"
  ]
}`,
  });

  // 기본값을 모두 false로 설정 (닫힌 상태)
  const [openSections, setOpenSections] = useState({
    methodRequest: false,
    urlQuery: false,
    httpHeaders: false,
    requestBody: false,
  });

  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([
    {
      id: '1',
      name: '',
      description: '',
      type: 'string',
      isArray: false,
      required: false,
      cacheKey: false,
    },
  ]);

  const [headers, setHeaders] = useState<Header[]>([
    {
      id: '1',
      name: '',
      description: '',
      type: 'string',
      required: false,
    },
  ]);

  const [formData, setFormData] = useState<FormData[]>([
    {
      id: '1',
      name: '',
      description: '',
      type: 'string',
      isArray: false,
      required: false,
    },
  ]);

  const [bodyModels, setBodyModels] = useState<BodyModel[]>([
    {
      id: '1',
      name: '',
      description: '',
      model: '',
    },
  ]);

  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [newContentType, setNewContentType] = useState('');
  const [contentTypeError, setContentTypeError] = useState('');

  // HTTP Method options
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  // Predefined endpoint URLs
  const endpointUrls = [
    'https://api.endpoint.com/',
    'https://jsonplaceholder.typicode.com/',
    'https://httpbin.org/',
    'https://reqres.in/api/',
    'https://api.github.com/',
  ];

  const handleBack = () => {
    router.push(`/services/api-management/resources?resourceId=${resourceId}`);
  };

  const handleCreateMethod = () => {
    if (!methodForm.methodType) {
      toast.error('메서드 유형을 선택해주세요.');
      return;
    }

    if (methodForm.integrationType === 'http' && !methodForm.httpMethod) {
      toast.error('HTTP 메서드를 선택해주세요.');
      return;
    }

    if (methodForm.integrationType === 'http') {
      const finalUrl = isDirectUrlInput ? methodForm.customEndpointUrl : methodForm.endpointUrl;
      if (!finalUrl) {
        toast.error('엔드포인트 URL을 입력해주세요.');
        return;
      }
    }

    // 실제 저장 로직 구현
    const methodData = {
      ...methodForm,
      finalEndpointUrl: isDirectUrlInput ? methodForm.customEndpointUrl : methodForm.endpointUrl,
      queryParameters: queryParameters.filter((param) => param.name),
      headers: headers.filter((header) => header.name),
      formData: formData.filter((data) => data.name),
      bodyModels: bodyModels.filter((model) => model.name),
      contentTypes,
      mockHeaders: mockHeaders.filter((header) => header.name),
    };

    console.log('Saving method data:', methodData);

    toast.success('메서드가 성공적으로 생성되었습니다.');
    handleBack();
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleApiKeyToggle = (checked: boolean) => {
    if (checked) {
      setIsApiKeyModalOpen(true);
    } else {
      setMethodForm({
        ...methodForm,
        apiKeyRequired: false,
        selectedApiKey: '',
      });
    }
  };

  const handleApiKeySelect = () => {
    if (isCreatingNewApiKey) {
      // 새 API 키 생성
      if (!newApiKeyForm.name.trim()) {
        toast.error('API 키 이름을 입력해주세요.');
        return;
      }

      const newApiKey: ApiKey = {
        id: Date.now().toString(),
        name: newApiKeyForm.name,
        description: newApiKeyForm.description,
        value: `api-key-${Date.now()}`,
      };

      setApiKeys([...apiKeys, newApiKey]);
      setMethodForm({
        ...methodForm,
        apiKeyRequired: true,
        selectedApiKey: newApiKey.id,
      });

      setNewApiKeyForm({ name: '', description: '' });
      setIsCreatingNewApiKey(false);
      toast.success('새 API 키가 생성되고 선택되었습니다.');
    } else {
      // 기존 API 키 선택
      if (!selectedApiKeyId) {
        toast.error('API 키를 선택해주세요.');
        return;
      }

      setMethodForm({
        ...methodForm,
        apiKeyRequired: true,
        selectedApiKey: selectedApiKeyId,
      });
      toast.success('API 키가 선택되었습니다.');
    }

    setIsApiKeyModalOpen(false);
    setSelectedApiKeyId('');
  };

  const handleApiKeyModalCancel = () => {
    setMethodForm({ ...methodForm, apiKeyRequired: false, selectedApiKey: '' });
    setIsApiKeyModalOpen(false);
    setSelectedApiKeyId('');
    setIsCreatingNewApiKey(false);
    setNewApiKeyForm({ name: '', description: '' });
  };

  const handleModelSelect = (modelId: string) => {
    if (modelId === 'create-new') {
      setIsModelModalOpen(true);
    }
  };

  const handleCreateModel = () => {
    if (!newModelForm.name.trim()) {
      toast.error('모델 이름을 입력해주세요.');
      return;
    }

    try {
      // JSON 스키마 유효성 검사
      JSON.parse(newModelForm.schema);
    } catch (error) {
      toast.error('올바른 JSON 스키마를 입력해주세요.');
      return;
    }

    const newModel: Model = {
      id: Date.now().toString(),
      name: newModelForm.name,
      description: newModelForm.description,
      schema: newModelForm.schema,
    };

    setModels([...models, newModel]);
    setNewModelForm({
      name: '',
      description: '',
      schema: `{
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": [
    "firstName"
  ]
}`,
    });
    setIsModelModalOpen(false);
    toast.success('새 모델이 생성되었습니다.');
  };

  const handleModelModalCancel = () => {
    setIsModelModalOpen(false);
    setNewModelForm({
      name: '',
      description: '',
      schema: `{
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": [
    "firstName"
  ]
}`,
    });
  };

  const addQueryParameter = () => {
    const newParam: QueryParameter = {
      id: Date.now().toString(),
      name: '',
      description: '',
      type: 'string',
      isArray: false,
      required: false,
      cacheKey: false,
    };
    setQueryParameters([...queryParameters, newParam]);
  };

  const updateQueryParameter = (id: string, field: keyof QueryParameter, value: any) => {
    setQueryParameters(
      queryParameters.map((param) => (param.id === id ? { ...param, [field]: value } : param))
    );
  };

  const removeQueryParameter = (id: string) => {
    setQueryParameters(queryParameters.filter((param) => param.id !== id));
  };

  const addHeader = () => {
    const newHeader: Header = {
      id: Date.now().toString(),
      name: '',
      description: '',
      type: 'string',
      required: false,
    };
    setHeaders([...headers, newHeader]);
  };

  const updateHeader = (id: string, field: keyof Header, value: any) => {
    setHeaders(
      headers.map((header) => (header.id === id ? { ...header, [field]: value } : header))
    );
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id));
  };

  const addBodyModel = () => {
    const newModel: BodyModel = {
      id: Date.now().toString(),
      name: '',
      description: '',
      model: '',
    };
    setBodyModels([...bodyModels, newModel]);
  };

  const updateBodyModel = (id: string, field: keyof BodyModel, value: any) => {
    setBodyModels(
      bodyModels.map((model) => (model.id === id ? { ...model, [field]: value } : model))
    );
  };

  const removeBodyModel = (id: string) => {
    setBodyModels(bodyModels.filter((model) => model.id !== id));
  };

  const IntegrationIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'http':
        return <Globe className="h-8 w-8 text-blue-500" />;
      case 'mock':
        return <Box className="h-8 w-8 text-purple-500" />;
      default:
        return <Box className="h-8 w-8 text-gray-500" />;
    }
  };

  // Get selected API key info
  const selectedApiKeyInfo = apiKeys.find((key) => key.id === methodForm.selectedApiKey);

  // Calculate schema byte count
  const schemaByteCount = new TextEncoder().encode(newModelForm.schema).length;

  const httpHeaderOptions = [
    'Content-Type',
    'Accept',
    'Authorization',
    'User-Agent',
    'Cache-Control',
    'Pragma',
    'Expires',
    'Origin',
    'Referer',
    'Cookie',
    'Set-Cookie',
    'Host',
    'X-Requested-With',
    'X-Forwarded-For',
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services/api-management">API Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services/api-management/resources">리소스</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>메서드 생성</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">메서드 생성</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                리소스: <span className="font-mono text-blue-600">{resourcePath}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              취소
            </Button>
            <Button
              onClick={handleCreateMethod}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              저장
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Left Panel - Method Creation Form */}
          <div className="space-y-6">
            <Card>
              <div className="pt-4"></div>
              <CardContent className="space-y-6">
                {/* Method Details */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="method-type" className="text-[16px] font-semibold mb-4">
                        메서드 유형
                      </Label>
                      <Select
                        value={methodForm.methodType}
                        onValueChange={(value) =>
                          setMethodForm({ ...methodForm, methodType: value })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="메서드 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                          <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                          <SelectItem value="HEAD">HEAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Integration Type */}
                <div>
                  <h3 className="text-[16px] font-semibold mb-4">통합 유형</h3>
                  <RadioGroup
                    value={methodForm.integrationType}
                    onValueChange={(value) =>
                      setMethodForm({ ...methodForm, integrationType: value })
                    }
                    className="grid grid-cols-4 space-y-4"
                  >
                    {/* HTTP */}
                    <div
                      className={`grid-cols-1 border rounded-lg p-4 transition-all ${
                        methodForm.integrationType === 'http'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="http" id="http" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <IntegrationIcon type="http" />
                            <div>
                              <Label
                                htmlFor="http"
                                className="text-base font-medium cursor-pointer"
                              >
                                HTTP
                              </Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                기존 HTTP 엔드포인트와 통합합니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* HTTP Configuration */}
                {methodForm.integrationType === 'http' && (
                  <div className="space-y-6">
                    {/* API Key Toggle */}
                    <div className="">
                      <div className="flex items-center mb-3 gap-3">
                        <div>
                          <Label className="text-[16px] font-semibold mb-4">API Key 설정</Label>
                        </div>
                        <Switch
                          checked={methodForm.apiKeyRequired}
                          onCheckedChange={handleApiKeyToggle}
                        />
                      </div>

                      {/* Selected API Key Info - More Prominent Display */}
                      {methodForm.selectedApiKey && selectedApiKeyInfo && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-green-900 dark:text-green-100">
                                  선택된 API 키
                                </h4>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                                  활성화됨
                                </span>
                              </div>
                              <p className="font-medium text-gray-900 dark:text-white mb-1">
                                {selectedApiKeyInfo.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {selectedApiKeyInfo.description}
                              </p>
                              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                                <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                                  ID: {selectedApiKeyInfo.id}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Endpoint URL */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Label className="text-[16px] font-semibold">엔드포인트 URL</Label>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-600">직접 입력</Label>
                          <Switch
                            checked={isDirectUrlInput}
                            onCheckedChange={setIsDirectUrlInput}
                          />
                        </div>
                      </div>

                      {isDirectUrlInput ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="https://your-api-endpoint.com/"
                            value={methodForm.customEndpointUrl}
                            onChange={(e) =>
                              setMethodForm({
                                ...methodForm,
                                customEndpointUrl: e.target.value,
                              })
                            }
                          />
                          <p className="text-xs text-gray-500">직접 을 입력하세요</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={methodForm.endpointUrl}
                            onValueChange={(value) =>
                              setMethodForm({ ...methodForm, endpointUrl: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="엔드포인트 URL 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {endpointUrls.map((url) => (
                                <SelectItem key={url} value={url}>
                                  {url}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="추가 파라미터 (예: /users/{id})"
                            value={methodForm.additionalParameter}
                            onChange={(e) =>
                              setMethodForm({
                                ...methodForm,
                                additionalParameter: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>

                    {/* 요청 검사기 */}
                    <div>
                      <Label className="text-[16px] font-semibold mb-4m">요청 검사기</Label>
                      <Select
                        value={methodForm.requestValidator}
                        onValueChange={(value) =>
                          setMethodForm({
                            ...methodForm,
                            requestValidator: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="없음">없음</SelectItem>
                          <SelectItem value="본문 검증">본문 검증</SelectItem>
                          <SelectItem value="헤더 검증">헤더 검증</SelectItem>
                          <SelectItem value="파라미터 검증">파라미터 검증</SelectItem>
                          <SelectItem value="본문 및 파라미터 검증">
                            본문 및 파라미터 검증
                          </SelectItem>
                          <SelectItem value="전체 검증">전체 검증</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Collapsible Sections */}
          <div className="space-y-4">
            {/* URL Query String Parameters */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible
                open={openSections.urlQuery}
                onOpenChange={() => toggleSection('urlQuery')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30 border-0 rounded-none"
                  >
                    <span className="text-lg font-semibold text-green-900 dark:text-green-100">
                      URL 쿼리 문자열 파라미터
                    </span>
                    {openSections.urlQuery ? (
                      <ChevronDown className="h-5 w-5 text-green-700" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-green-700" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <div className="space-y-4">
                      <div className=" dark:bg-blue-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-blue-100 mb-3">
                          쿼리 스트링
                        </h4>

                        {queryParameters.map((param, index) => (
                          <div key={param.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                            <div className="col-span-6">
                              <Input
                                placeholder="이름"
                                value={param.name}
                                onChange={(e) =>
                                  updateQueryParameter(param.id, 'name', e.target.value)
                                }
                                className={param.name === '' ? 'border-red-300' : ''}
                              />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <div className="flex items-center space-x-2">
                                <Label className="text-xs">Required</Label>
                                <Switch
                                  checked={param.required}
                                  onCheckedChange={(checked) =>
                                    updateQueryParameter(param.id, 'required', checked)
                                  }
                                  size="sm"
                                />
                              </div>
                            </div>
                            <div className="col-span-3 flex gap-2 justify-end">
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addQueryParameter}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                추가
                              </Button>
                              {queryParameters.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeQueryParameter(param.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                        {queryParameters.some((param) => param.name === '') && (
                          <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>이름은 비워둘 수 없습니다.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* HTTP Request Headers */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible
                open={openSections.httpHeaders}
                onOpenChange={() => toggleSection('httpHeaders')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/30 border-0 rounded-none"
                  >
                    <span className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                      HTTP 요청 헤더
                    </span>
                    {openSections.httpHeaders ? (
                      <ChevronDown className="h-5 w-5 text-purple-700" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-purple-700" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <div className="space-y-4">
                      <div className="dark:bg-green-950/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-green-100 mb-3">
                          헤더
                        </h4>

                        {headers.map((header, index) => (
                          <div
                            key={header.id}
                            className="grid grid-cols-12 gap-3 items-center mb-3"
                          >
                            <div className="col-span-8">
                              <Select
                                value={header.type}
                                onValueChange={(value) => updateHeader(header.id, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {httpHeaderOptions.map((headerName) => (
                                    <SelectItem key={headerName} value={headerName}>
                                      {headerName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <div className="flex items-center space-x-2">
                                <Label className="text-xs">Required</Label>
                                <Switch
                                  checked={header.required}
                                  onCheckedChange={(checked) =>
                                    updateHeader(header.id, 'required', checked)
                                  }
                                  size="sm"
                                />
                              </div>
                            </div>
                            <div className="col-span-2 flex gap-2 justify-end">
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={addHeader}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                추가
                              </Button>
                              {headers.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeHeader(header.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Request Body */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible
                open={openSections.requestBody}
                onOpenChange={() => toggleSection('requestBody')}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 border-0 rounded-none"
                  >
                    <span className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                      요청 본문
                    </span>
                    {openSections.requestBody ? (
                      <ChevronDown className="h-5 w-5 text-orange-700" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-orange-700" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 bg-white dark:bg-gray-900 space-y-6">
                    {/* Form Data Section */}

                    {/* Body Models Section */}
                    <div className="dark:bg-orange-950/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-orange-100 mb-3">
                        요청 모델
                      </h4>

                      {bodyModels.map((model, index) => (
                        <div key={model.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                          <div className="col-span-5">
                            <Input
                              placeholder="콘텐츠 유형"
                              value={model.name}
                              onChange={(e) => updateBodyModel(model.id, 'name', e.target.value)}
                            />
                          </div>

                          <div className="col-span-5">
                            <Select
                              value={model.model}
                              onValueChange={(value) => {
                                if (value === 'create-new') {
                                  handleModelSelect(value);
                                } else {
                                  updateBodyModel(model.id, 'model', value);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="모델" />
                              </SelectTrigger>
                              <SelectContent>
                                {models.map((availableModel) => (
                                  <SelectItem key={availableModel.id} value={availableModel.name}>
                                    {availableModel.name}
                                  </SelectItem>
                                ))}
                                <SelectItem
                                  value="create-new"
                                  className="text-blue-600 font-medium"
                                >
                                  <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    새로운 모델 생성
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2 flex gap-2 justify-end">
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={addBodyModel}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              추가
                            </Button>
                            {bodyModels.length > 1 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeBodyModel(model.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Enhanced API Key Selection Modal */}
        <Dialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Key className="h-5 w-5" />
                API 키 설정
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              {/* Toggle between existing and new API key */}
              <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Button
                  variant={!isCreatingNewApiKey ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsCreatingNewApiKey(false)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  기존 API 키 선택
                </Button>
                <Button
                  variant={isCreatingNewApiKey ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsCreatingNewApiKey(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />새 API 키 생성
                </Button>
              </div>

              {!isCreatingNewApiKey ? (
                // Existing API Keys Selection
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    사용할 API 키를 선택하세요.
                  </p>

                  {apiKeys.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {apiKeys.map((apiKey) => (
                        <div
                          key={apiKey.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedApiKeyId === apiKey.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => setSelectedApiKeyId(apiKey.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="apiKey"
                              value={apiKey.id}
                              checked={selectedApiKeyId === apiKey.id}
                              onChange={() => setSelectedApiKeyId(apiKey.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {apiKey.name}
                                </h4>
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
                                  ID: {apiKey.id}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {apiKey.description}
                              </p>
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs font-mono text-gray-700 dark:text-gray-300">
                                {apiKey.value}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>등록된 API 키가 없습니다.</p>
                      <p className="text-sm">새 API 키를 생성해주세요.</p>
                    </div>
                  )}
                </div>
              ) : (
                // New API Key Creation Form
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    새로운 API 키를 생성합니다.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-api-key-name" className="text-sm font-medium">
                        API 키 이름 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="new-api-key-name"
                        placeholder="예: Production API Key"
                        value={newApiKeyForm.name}
                        onChange={(e) =>
                          setNewApiKeyForm({ ...newApiKeyForm, name: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-api-key-description" className="text-sm font-medium">
                        설명
                      </Label>
                      <Textarea
                        id="new-api-key-description"
                        placeholder="API 키에 대한 설명을 입력하세요"
                        value={newApiKeyForm.description}
                        onChange={(e) =>
                          setNewApiKeyForm({ ...newApiKeyForm, description: e.target.value })
                        }
                        className="mt-1 min-h-[80px]"
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-1">참고사항</p>
                          <p>API 키는 자동으로 생성되며, 생성 후 안전한 곳에 보관해주세요.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleApiKeyModalCancel}>
                취소
              </Button>
              <Button
                onClick={handleApiKeySelect}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={
                  isCreatingNewApiKey
                    ? !newApiKeyForm.name.trim()
                    : !selectedApiKeyId && apiKeys.length > 0
                }
              >
                {isCreatingNewApiKey ? '생성 및 선택' : '선택'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Model Creation Modal */}
        <Dialog open={isModelModalOpen} onOpenChange={setIsModelModalOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Code className="h-5 w-5" />
                새로운 모델 생성
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="text-red-500">*</span> 필수 입력 사항입니다.
              </p>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <div className="space-y-6 h-full">
                {/* Model Name and Description */}
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="model-name"
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      모델 이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="model-name"
                      placeholder="예: UserProfile"
                      value={newModelForm.name}
                      onChange={(e) => setNewModelForm({ ...newModelForm, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model-description" className="text-sm font-medium">
                      설명
                    </Label>
                    <Input
                      id="model-description"
                      placeholder="모델에 대한 간단한 설명을 입력하세요"
                      value={newModelForm.description}
                      onChange={(e) =>
                        setNewModelForm({ ...newModelForm, description: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Schema Section */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      Schema <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>JSON 형식으로 입력해주세요</span>
                    </div>
                  </div>

                  <Tabs defaultValue="schema" className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-3">
                      <TabsTrigger value="schema" className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Schema
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        미리보기
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="schema" className="flex-1 mt-0">
                      <div className="relative h-full">
                        <Textarea
                          value={newModelForm.schema}
                          onChange={(e) =>
                            setNewModelForm({ ...newModelForm, schema: e.target.value })
                          }
                          className="font-mono text-sm resize-none h-full min-h-[400px] p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400"
                          placeholder="JSON 스키마를 입력하세요..."
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                          {schemaByteCount}/65535 bytes
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="flex-1 mt-0">
                      <div className="h-full min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          스키마 미리보기:
                        </div>
                        <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-auto h-full">
                          {(() => {
                            try {
                              return JSON.stringify(JSON.parse(newModelForm.schema), null, 2);
                            } catch (error) {
                              return '올바른 JSON 형식이 아닙니다.';
                            }
                          })()}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleModelModalCancel}>
                아니요
              </Button>
              <Button
                onClick={handleCreateModel}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newModelForm.name.trim()}
              >
                추가
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
