'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Copy, ArrowRight } from 'lucide-react';
import { MethodRequestView } from './MethodRequestView';
import { MethodRequestEdit } from './MethodRequestEdit';
import { MethodTestTab } from './MethodTestTab';
import { MethodResponseTab } from './MethodResponseTab';
import { MethodResponseEdit } from './MethodResponseEdit';
import { DeleteMethodDialog } from './DeleteMethodDialog';
import type {
  TestResponse,
  MethodResponse,
  QueryParameter,
  Method,
  RequestHeader,
  RequestBodyModel,
  Model,
} from '@/types/resource';
import { useClipboard } from 'use-clipboard-copy';
import { toast, Toaster } from 'sonner';

export default function MethodDetailCard({ selectedMethod }: Method) {
  console.log(selectedMethod);

  const [activeTab, setActiveTab] = useState('method-request');
  const [selectedFlowStep, setSelectedFlowStep] = useState('');
  const [isMethodDeleteDialogOpen, setIsMethodDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<Method | null>(null);

  // Test Tab States
  const [testSettings, setTestSettings] = useState({
    queryString: '',
    headers: '',
    requestBody: '',
    contentType: 'application/json',
  });
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [methodResponses, setMethodResponses] = useState<MethodResponse[]>([
    {
      id: '1',
      statusCode: '200',
      headers: [{ id: '1', name: 'content-type', value: '' }],
      bodies: [{ id: '1', contentType: 'application/json', model: 'Empty' }],
    },
    {
      id: '2',
      statusCode: '201',
      headers: [{ id: '2', name: 'authorization', value: '' }],
      bodies: [{ id: '2', contentType: 'application/html', model: 'Error' }],
    },
  ]);

  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([]);
  const [requestHeaders, setRequestHeaders] = useState<RequestHeader[]>([
    {
      id: '1',
      name: 'Content-Type',
      description: '요청 콘텐츠 타입',
      type: 'string',
      required: true,
    },
  ]);
  const [requestBodyModels, setRequestBodyModels] = useState<RequestBodyModel[]>([]);

  const [editForm, setEditForm] = useState({
    apiKeyRequired: false,
    sdkOperationName: '',
    requestValidator: '없음',
  });

  // Available models
  const [availableModels, setAvailableModels] = useState<Model[]>([
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
    {
      id: '3',
      name: 'Order',
      description: '주문 정보 모델',
      schema: `{
  "type": "object",
  "properties": {
    "orderId": {
      "type": "string",
      "description": "주문 ID"
    },
    "userId": {
      "type": "integer",
      "description": "사용자 ID"
    },
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/Product"
      }
    },
    "totalAmount": {
      "type": "number",
      "description": "총 금액"
    }
  },
  "required": ["orderId", "userId", "items", "totalAmount"]
}`,
    },
  ]);

  // Request validators
  const requestValidators = [
    { value: '없음', label: '없음' },
    { value: '본문 검증', label: '본문 검증' },
    { value: '파라미터 검증', label: '파라미터 검증' },
    { value: '본문 및 파라미터 검증', label: '본문 및 파라미터 검증' },
  ];

  const clipboard = useClipboard();

  const handleCopyEndpoint = () => {
    clipboard.copy(selectedMethod?.endpointUrl);
    toast.success('ARN이 클립보드에 복사되었습니다.');
  };

  const handleFlowStepClick = (step: string) => {
    setSelectedFlowStep(step);
    if (step === 'method-request') {
      setActiveTab('method-request');
    } else if (step === 'method-response') {
      setActiveTab('method-response');
    }
  };

  const handleEditMethod = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    setIsEditMode(false);
    toast.success('메서드 설정이 저장되었습니다.');
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form to original values
    if (selectedMethod) {
      setEditForm({
        apiKeyRequired: selectedMethod.apiKey !== '-',
        sdkOperationName: selectedMethod.summary || '',
        requestValidator: selectedMethod.requestValidator || '없음',
      });
    }
  };

  const handleTest = async () => {
    if (!selectedMethod) return;

    setIsTestLoading(true);
    const startTime = Date.now();

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Mock response based on method type
      const mockResponse: TestResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': testSettings.contentType,
          'Access-Control-Allow-Origin': '*',
          'X-Response-Time': `${responseTime}ms`,
        },
        body:
          selectedMethod.type === 'GET'
            ? JSON.stringify({ message: 'Success', data: { id: 1, name: 'Test Data' } }, null, 2)
            : JSON.stringify({ message: 'Created successfully', id: Date.now() }, null, 2),
        responseTime,
      };

      setTestResponse(mockResponse);
      toast.success('API 테스트가 완료되었습니다.');
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setTestResponse({
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': `${responseTime}ms`,
        },
        body: JSON.stringify(
          { error: 'Internal server error', message: 'Something went wrong' },
          null,
          2
        ),
        responseTime,
      });
      toast.error('API 테스트 중 오류가 발생했습니다.');
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleCreateResponse = () => {
    toast.success('새 응답이 생성되었습니다.');
  };

  const handleEditResponse = (response: MethodResponse) => {
    toast.success('응답 편집 모드로 전환되었습니다.');
  };

  const handleDeleteResponse = (response: MethodResponse) => {
    toast.success('응답이 삭제되었습니다.');
  };

  // Query Parameter functions
  const addQueryParameter = () => {
    const newParam: QueryParameter = {
      id: Date.now().toString(),
      name: '',
      description: '',
      type: 'string',
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

  // Request Header functions
  const addRequestHeader = () => {
    const newHeader: RequestHeader = {
      id: Date.now().toString(),
      name: '',
      description: '',
      type: 'string',
      required: false,
    };
    setRequestHeaders([...requestHeaders, newHeader]);
  };

  const updateRequestHeader = (id: string, field: keyof RequestHeader, value: any) => {
    setRequestHeaders(
      requestHeaders.map((header) => (header.id === id ? { ...header, [field]: value } : header))
    );
  };

  const removeRequestHeader = (id: string) => {
    // Don't allow removing Content-Type header
    const header = requestHeaders.find((h) => h.id === id);
    if (header?.name === 'Content-Type') {
      toast.error('Content-Type 헤더는 삭제할 수 없습니다.');
      return;
    }
    setRequestHeaders(requestHeaders.filter((header) => header.id !== id));
  };

  // Request Body Model functions
  const addRequestBodyModel = () => {
    const newModel: RequestBodyModel = {
      id: Date.now().toString(),
      contentType: 'application/json',
      modelName: '',
      modelId: '',
    };
    setRequestBodyModels([...requestBodyModels, newModel]);
  };

  const updateRequestBodyModel = (id: string, field: keyof RequestBodyModel, value: any) => {
    setRequestBodyModels(
      requestBodyModels.map((model) => (model.id === id ? { ...model, [field]: value } : model))
    );
  };

  const removeRequestBodyModel = (id: string) => {
    setRequestBodyModels(requestBodyModels.filter((model) => model.id !== id));
  };

  // Model management functions
  const deleteModel = (modelId: string) => {
    setAvailableModels(availableModels.filter((model) => model.id !== modelId));
    // Also remove from request body models if used
    setRequestBodyModels(requestBodyModels.filter((model) => model.modelId !== modelId));
    toast.success('모델이 삭제되었습니다.');
  };

  useEffect(() => {
    if (selectedMethod) {
      setEditForm({
        apiKeyRequired: selectedMethod.apiKey !== '-',
        sdkOperationName: selectedMethod.summary || '',
        requestValidator: selectedMethod.requestValidator || '없음',
      });

      // Initialize query parameters
      const queryParams =
        selectedMethod.parameters
          ?.filter((p: any) => p.in === 'query')
          .map((p: any, index: number) => ({
            id: `query-${index}`,
            name: p.name,
            description: p.description || '',
            type: p.schema?.type || 'string',
            required: p.required || false,
            cacheKey: false,
          })) || [];
      setQueryParameters(queryParams);

      // Initialize request headers
      const headerParams =
        selectedMethod.parameters
          ?.filter((p: any) => p.in === 'header')
          .map((p: any, index: number) => ({
            id: `header-${index}`,
            name: p.name,
            description: p.description || '',
            type: p.schema?.type || 'string',
            required: p.required || false,
          })) || [];

      // Add default Content-Type header if not exists
      const hasContentType = headerParams.some((h: any) => h.name.toLowerCase() === 'content-type');
      if (!hasContentType) {
        headerParams.unshift({
          id: 'content-type',
          name: 'Content-Type',
          description: '요청 콘텐츠 타입',
          type: 'string',
          required: true,
        });
      }
      setRequestHeaders(headerParams);

      // Initialize request body models
      if (selectedMethod.requestBody?.content) {
        const bodyModels = Object.entries(selectedMethod.requestBody.content).map(
          ([contentType, content]: [string, any], index: number) => ({
            id: `body-${index}`,
            contentType,
            modelName: content.schema?.$ref ? content.schema.$ref.split('/').pop() : 'Empty',
            modelId: content.schema?.$ref ? content.schema.$ref.split('/').pop() : '',
          })
        );
        setRequestBodyModels(bodyModels);
      } else {
        setRequestBodyModels([]);
      }
    }
  }, [selectedMethod]);
  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Method Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className=" mb-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedMethod.resourcePath} - {selectedMethod.type} - 메서드 상세
                </h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
                    onClick={() => {
                      setMethodToDelete(selectedMethod);
                      setIsMethodDeleteDialogOpen(true);
                    }}>
                    삭제
                  </Button>
                </div>
              </div>
              <div className="w-[100%] flex items-center justify-between mt-2">
                <div className="w-[40%]">
                  <div className="flex items-center gap-2  mb-2">
                    <div className="w-20 text-sm text-gray-600 dark:text-gray-400">메서드 이름</div>
                    <div className="font-semibold text-sm">{selectedMethod.summary}</div>
                  </div>
                  <div className="flex items-center gap-2  mb-2">
                    <div className="w-20 text-sm text-gray-600 dark:text-gray-400">메서드 설명</div>
                    <div className="font-semibold text-sm">{selectedMethod.description}</div>
                  </div>
                  <div className="flex items-center gap-2  mb-2">
                    <div className="w-20 text-sm text-gray-600 dark:text-gray-400">메서드 ID</div>
                    <div className="font-mono text-sm">{selectedMethod.apiKeys.methodId}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-sm text-gray-600 dark:text-gray-400">URL</span>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                      <code className="text-sm font-mono">{selectedMethod?.endpointUrl}</code>
                      <Button size="sm" variant="ghost" onClick={handleCopyEndpoint}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6 w-[70%]">
                  <div className="flex items-center justify-between">
                    {/* Client */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white border-2 border-blue-300 rounded-lg flex items-center justify-center mb-2">
                        <Monitor className="h-6 w-6 text-gray-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        클라이언트
                      </span>
                    </div>

                    <div className="space-y-3">
                      <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                      <ArrowRight className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                    </div>

                    {/* Method Request & Response */}
                    <div className="flex flex-col items-center ">
                      <div
                        className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center cursor-pointer transition-all mb-2 ${
                          selectedFlowStep === 'method-request'
                            ? 'bg-blue-200 dark:bg-blue-800 '
                            : ''
                        }`}
                        onClick={() => handleFlowStepClick('method-request')}>
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          메서드 요청
                        </div>
                      </div>

                      <div
                        className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center  cursor-pointer transition-all ${
                          selectedFlowStep === 'method-response'
                            ? 'bg-blue-200 dark:bg-blue-800'
                            : ''
                        }`}
                        onClick={() => handleFlowStepClick('method-response')}>
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          메서드 응답
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                      <ArrowRight className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                    </div>

                    {/* HTTP Response */}
                    <div className="flex flex-col items-center">
                      <div className="bg-white border-2 border-blue-300 rounded-lg p-3 mb-2 min-w-[80px]">
                        <div className="text-center">
                          <div className="text-xs font-bold text-gray-600">HTTP</div>
                          <div className="text-xs text-gray-500">응답</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        HTTP 응답
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Method Tabs */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="method-request">메서드 요청</TabsTrigger>
              <TabsTrigger value="method-response">메서드 응답</TabsTrigger>
              <TabsTrigger value="test">테스트</TabsTrigger>
            </TabsList>

            {/* Method Request Tab */}
            {/* 메서드 요청 설정 */}
            <TabsContent value="method-request" className="space-y-6 mt-6">
              {!isEditMode ? (
                <MethodRequestView
                  selectedMethod={selectedMethod}
                  queryParameters={queryParameters}
                  requestHeaders={requestHeaders}
                  requestBodyModels={requestBodyModels}
                  handleEditMethod={handleEditMethod}
                />
              ) : (
                <MethodRequestEdit
                  editForm={editForm}
                  setEditForm={setEditForm}
                  queryParameters={queryParameters}
                  updateQueryParameter={updateQueryParameter}
                  removeQueryParameter={removeQueryParameter}
                  addQueryParameter={addQueryParameter}
                  requestHeaders={requestHeaders}
                  updateRequestHeader={updateRequestHeader}
                  removeRequestHeader={removeRequestHeader}
                  addRequestHeader={addRequestHeader}
                  requestBodyModels={requestBodyModels}
                  updateRequestBodyModel={updateRequestBodyModel}
                  removeRequestBodyModel={removeRequestBodyModel}
                  addRequestBodyModel={addRequestBodyModel}
                  availableModels={availableModels}
                  deleteModel={deleteModel}
                  handleCancelEdit={handleCancelEdit}
                  handleSaveEdit={handleSaveEdit}
                  requestValidators={requestValidators}
                />
              )}
            </TabsContent>

            {/* Method Response Tab */}
            <TabsContent value="method-response" className="space-y-6 mt-6">
              {!isEditMode ? (
                <MethodResponseTab
                  methodResponses={methodResponses}
                  handleCreateResponse={handleCreateResponse}
                  handleEditResponse={handleEditResponse}
                  handleDeleteResponse={handleDeleteResponse}
                  availableModels={availableModels}
                />
              ) : (
                <MethodResponseEdit
                  methodResponses={methodResponses}
                  handleCreateResponse={handleCreateResponse}
                  handleEditResponse={handleEditResponse}
                  handleDeleteResponse={handleDeleteResponse}
                  handleCancelEdit={handleCancelEdit}
                  handleSaveEdit={handleSaveEdit}
                  availableModels={availableModels}
                />
              )}
            </TabsContent>

            {/* Enhanced Test Tab */}
            <TabsContent value="test" className="space-y-6 mt-6">
              <MethodTestTab
                selectedMethod={selectedMethod}
                testSettings={testSettings}
                setTestSettings={setTestSettings}
                handleTest={handleTest}
                isTestLoading={isTestLoading}
                testResponse={testResponse}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Method Confirmation Dialog */}
      <DeleteMethodDialog
        open={isMethodDeleteDialogOpen}
        onOpenChange={setIsMethodDeleteDialogOpen}
        methodToDelete={methodToDelete}
      />
    </>
  );
}
