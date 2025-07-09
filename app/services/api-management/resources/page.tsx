'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, Monitor, Copy, ArrowRight, Rocket, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { mockData2 } from '@/lib/data';
import { Switch } from '@/components/ui/switch';

import {
  QueryParameter,
  CorsSettings,
  Model,
  Resource,
  Method,
  RequestHeader,
  RequestBodyModel,
  TestResponse,
  MethodResponse,
} from '@/types/resource';
import { getMethodStyle } from '@/lib/etc';
import { ResourceCreateDialog } from './components/ResourceCreateDialog';
import { CorsSettingsDialog } from './components/CorsSettingsDialog';
import { DeleteResourceDialog } from './components/DeleteResourceDialog';
import { DeleteMethodDialog } from './components/DeleteMethodDialog';
import { ResourceTree } from './components/ResourceTree';
import { MethodRequestView } from './components/MethodRequestView';
import { MethodRequestEdit } from './components/MethodRequestEdit';
import { ResourceDetailCard } from './components/ResourceDetailCard';
import { MethodTestTab } from './components/MethodTestTab';
import { MethodResponseTab } from './components/MethodResponseTab';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function ApiResourcesPage() {
  const router = useRouter();
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  // mockData2의 OpenAPI 구조를 기존 Resource/Method[] 형태로 변환하는 함수 추가
  function convertOpenApiToResources(openApiPaths: any): Resource[] {
    return Object.entries(openApiPaths).map(([path, methods]: [string, any], idx) => ({
      id: `resource-${idx}`,
      path,
      name: path.replace(/^\//, '') || 'root',
      corsEnabled: false, // mockData2에는 cors 정보 없음
      corsSettings: undefined, // ← 이 줄 추가
      methods: Object.entries(methods).map(([type, methodObj]: [string, any], mIdx) => ({
        id: methodObj['x-methodId'] || '-',
        type: type.toUpperCase(),
        permissions: methodObj['x-permissions'] || '-',
        apiKey: methodObj['x-apiKeyId'] || '-',
        resourcePath: path,
        endpointUrl: (mockData2.spec.servers?.[0]?.url || '') + path,
        summary: methodObj.summary,
        description: methodObj.description,
        parameters: methodObj.parameters,
        requestBody: methodObj.requestBody,
        responses: methodObj.responses,
        security: methodObj.security,
        requestValidator: '없음',
      })),
    }));
  }

  // 기존 useState(Resource[]) 부분을 mockData2 기반으로 초기화
  const [resources, setResources] = useState<Resource[]>(
    convertOpenApiToResources(mockData2.spec.paths)
  );

  const [selectedResource, setSelectedResource] = useState<Resource>(resources[0]);
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMethodDeleteDialogOpen, setIsMethodDeleteDialogOpen] = useState(false);
  const [isCorsModalOpen, setIsCorsModalOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<Method | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Edit form states
  const [editForm, setEditForm] = useState({
    apiKeyRequired: false,
    sdkOperationName: '',
    requestValidator: '없음',
  });

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

  const [createResourceForm, setCreateResourceForm] = useState({
    path: '',
    name: '',
    corsEnabled: false,
    corsSettings: {
      allowMethods: [] as string[],
      allowHeaders: '',
      allowOrigin: '*',
      exposeHeaders: '',
      maxAge: '',
      allowCredentials: false,
    },
  });

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

  const [corsForm, setCorsForm] = useState<CorsSettings>({
    allowMethods: [],
    allowHeaders: '',
    allowOrigin: '*',
    exposeHeaders: '',
    maxAge: '',
    allowCredentials: false,
  });

  // Method Detail States
  const [activeTab, setActiveTab] = useState('method-request');
  const [selectedFlowStep, setSelectedFlowStep] = useState('');

  // Test Tab States
  const [testSettings, setTestSettings] = useState({
    queryString: '',
    headers: '',
    requestBody: '',
    contentType: 'application/json',
  });
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);

  // Available HTTP methods for CORS
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  // Request validators
  const requestValidators = [
    { value: '없음', label: '없음' },
    { value: '본문 검증', label: '본문 검증' },
    { value: '파라미터 검증', label: '파라미터 검증' },
    { value: '본문 및 파라미터 검증', label: '본문 및 파라미터 검증' },
  ];

  // Initialize edit form when method changes
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
      const hasContentType = headerParams.some((h) => h.name.toLowerCase() === 'content-type');
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

  // Sync heights
  useEffect(() => {
    const syncHeights = () => {
      if (leftSidebarRef.current && rightContentRef.current) {
        const rightHeight = rightContentRef.current.offsetHeight;
        leftSidebarRef.current.style.height = `${rightHeight}px`;
      }
    };

    syncHeights();
    window.addEventListener('resize', syncHeights);

    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(syncHeights);
    if (rightContentRef.current) {
      observer.observe(rightContentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener('resize', syncHeights);
      observer.disconnect();
    };
  }, [selectedMethod, activeTab]);

  const handleBack = () => {
    router.push('/services/api-management');
  };

  const handleCreateResource = () => {
    if (!createResourceForm.path.trim() || !createResourceForm.name.trim()) {
      toast.error('리소스 경로와 이름을 입력해주세요.');
      return;
    }

    const newResource: Resource = {
      id: Date.now().toString(),
      path: createResourceForm.path,
      name: createResourceForm.name,
      corsEnabled: createResourceForm.corsEnabled,
      corsSettings: createResourceForm.corsEnabled ? createResourceForm.corsSettings : undefined,
      methods: [],
    };

    setResources([...resources, newResource]);
    setIsCreateModalOpen(false);
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
    toast.success(`리소스 '${newResource.name}'이(가) 생성되었습니다.`);
  };

  const handleDeleteResource = () => {
    if (selectedResource.id === 'root') {
      toast.error('루트 리소스는 삭제할 수 없습니다.');
      return;
    }

    setIsDeleteDialogOpen(false);
    toast.success(`리소스 '${selectedResource.name}'이(가) 삭제되었습니다.`);
  };

  const handleDeleteMethod = () => {
    if (methodToDelete) {
      toast.success(
        `메서드 '${methodToDelete.type} ${methodToDelete.resourcePath}'이(가) 삭제되었습니다.`
      );
      setMethodToDelete(null);
      setIsMethodDeleteDialogOpen(false);
    }
  };

  const handleCreateMethod = () => {
    router.push(
      `/services/api-management/resources/methods?resourceId=${selectedResource.id}&resourcePath=${selectedResource.path}`
    );
  };

  const handleMethodClick = (method: Method, resource: Resource) => {
    console.log(method, resource);
    setSelectedMethod(method);
    setSelectedResource(resource);
    setActiveTab('method-request');
    setIsEditMode(false);
  };

  const handleCopyArn = () => {
    const arn = `arn:aws:execute-api:ap-northeast-2:446785114695:yr5g5hoch/*/${selectedMethod?.type}${selectedMethod?.resourcePath}`;
    navigator.clipboard.writeText(arn);
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

  const handleCorsClick = () => {
    if (selectedResource.corsEnabled && selectedResource.corsSettings) {
      setCorsForm(selectedResource.corsSettings);
      setIsCorsModalOpen(true);
    }
  };

  const handleCorsUpdate = () => {
    // Update CORS settings logic here
    toast.success('CORS 설정이 업데이트되었습니다.');
    setIsCorsModalOpen(false);
  };

  const addCorsMethod = (method: string) => {
    if (!corsForm.allowMethods.includes(method)) {
      setCorsForm({
        ...corsForm,
        allowMethods: [...corsForm.allowMethods, method],
      });
    }
  };

  const removeCorsMethod = (method: string) => {
    setCorsForm({
      ...corsForm,
      allowMethods: corsForm.allowMethods.filter((m) => m !== method),
    });
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

  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const availableResourcePaths = ['/', '/api', '/users', '/products', '/orders'];

  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isDirectUrlInput, setIsDirectUrlInput] = useState(false);

  const [deploymentData, setDeploymentData] = useState({
    stage: '',
    version: '',
    description: '',
    newStageName: '',
    newStageDescription: '',
  });
  const handleDeploy = () => {
    setDeploymentData({
      stage: '',
      version: '',
      description: '',
      newStageName: '',
      newStageDescription: '',
    });
    setIsDeployModalOpen(true);
  };

  const handleDeploySubmit = () => {
    if (deploymentData.stage === 'new') {
      if (!deploymentData.newStageName.trim()) {
        toast.error('새 스테이지 이름을 입력해주세요.');
        return;
      }
      // 새 스테이지 생성 로직
      toast.success(
        `새 스테이지 '${deploymentData.newStageName}'가 생성되고 이(가) 성공적으로 배포되었습니다.`
      );
    } else {
      if (!deploymentData.stage) {
        toast.error('배포 스테이지를 선택해주세요.');
        return;
      }
      toast.success(`이(가) ${deploymentData.stage} 스테이지에 성공적으로 배포되었습니다.`);
    }

    setIsDeployModalOpen(false);
    setDeploymentData({
      stage: '',
      version: '',
      description: '',
      newStageName: '',
      newStageDescription: '',
    });
  };

  const handleDeployModalClose = () => {
    setIsDeployModalOpen(false);
    setDeploymentData({
      stage: '',
      version: '',
      description: '',
      newStageName: '',
      newStageDescription: '',
    });
  };

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
              <BreadcrumbPage>리소스</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">리소스</h1>
          </div>
          <div>
            <Button
              size="sm"
              onClick={() => handleDeploy()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              API 배포
              <Rocket className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Resource Tree */}
          {/* 리소스 목록 */}
          <div className="col-span-3">
            <div
              ref={leftSidebarRef}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">리소스 목록</h3>
                <Button
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 h-7"
                >
                  리소스 생성
                </Button>
              </div>

              {/* renderResourceTree */}
              <div className="space-y-1">
                <ResourceTree
                  mockData2={mockData2}
                  selectedPath={selectedPath}
                  setSelectedPath={setSelectedPath}
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  getMethodStyle={getMethodStyle}
                  setActiveTab={setActiveTab}
                  setIsEditMode={setIsEditMode}
                />
              </div>
            </div>
          </div>

          {/* Main Right Content */}
          <div className="col-span-9">
            <div ref={rightContentRef}>
              {selectedMethod ? (
                /* Method Detail View */
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
                              onClick={() => setIsMethodDeleteDialogOpen(true)}
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2  mb-2">
                            <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                              메서드 ID
                            </div>
                            <div className="font-mono text-sm">{selectedMethod.id}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-16 text-sm text-gray-600 dark:text-gray-400">
                              URL
                            </span>
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                              <code className="text-sm font-mono">
                                {selectedMethod.endpointUrl}
                              </code>
                              <Button size="sm" variant="ghost" onClick={handleCopyArn}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Updated Flow Diagram - matching the provided image */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        {/* Client */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-2">
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
                            onClick={() => handleFlowStepClick('method-request')}
                          >
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
                            onClick={() => handleFlowStepClick('method-response')}
                          >
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
                          <div className="bg-white border-2 border-gray-300 rounded-lg p-3 mb-2 min-w-[80px]">
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
                        <MethodResponseTab
                          methodResponses={methodResponses}
                          handleCreateResponse={handleCreateResponse}
                          handleEditResponse={handleEditResponse}
                          handleDeleteResponse={handleDeleteResponse}
                        />
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
              ) : (
                /* Resource Detail View */
                <ResourceDetailCard
                  mockData2={mockData2}
                  selectedResource={selectedResource}
                  handleCorsClick={handleCorsClick}
                  handleCreateMethod={handleCreateMethod}
                  handleMethodClick={handleMethodClick}
                  setMethodToDelete={setMethodToDelete}
                  setIsMethodDeleteDialogOpen={setIsMethodDeleteDialogOpen}
                  getMethodStyle={getMethodStyle}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Resource Modal */}
      <ResourceCreateDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        createResourceForm={createResourceForm}
        setCreateResourceForm={setCreateResourceForm}
        handleCreateResource={handleCreateResource}
        availableResourcePaths={availableResourcePaths}
        httpMethods={httpMethods}
      />

      {/* CORS Settings Modal */}
      <CorsSettingsDialog
        open={isCorsModalOpen}
        onOpenChange={setIsCorsModalOpen}
        corsForm={corsForm}
        setCorsForm={setCorsForm}
        handleCorsUpdate={handleCorsUpdate}
        httpMethods={httpMethods}
        addCorsMethod={addCorsMethod}
        removeCorsMethod={removeCorsMethod}
      />

      {/* Delete Resource Confirmation Dialog */}
      <DeleteResourceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedResource={selectedResource}
        handleDeleteResource={handleDeleteResource}
      />

      {/* Delete Method Confirmation Dialog */}
      <DeleteMethodDialog
        open={isMethodDeleteDialogOpen}
        onOpenChange={setIsMethodDeleteDialogOpen}
        methodToDelete={methodToDelete}
        handleDeleteMethod={handleDeleteMethod}
      />

      <Dialog open={isDeployModalOpen} onOpenChange={handleDeployModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Rocket className="h-5 w-5 mr-2 text-orange-500" />
              API 배포
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deploy-stage" className="text-sm font-medium">
                배포 할 스테이지
              </Label>
              <Select
                value={deploymentData.stage}
                onValueChange={(value) => setDeploymentData({ ...deploymentData, stage: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="스테이지 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="prod">Production</SelectItem>
                  <SelectItem value="new">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />새 스테이지 생성
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 새 스테이지 생성 필드들 */}
            {deploymentData.stage === 'new' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="h-4 w-4 text-orange-500" />
                  <Label className="text-sm font-medium text-gray-700">새 스테이지 정보</Label>
                </div>
                <div>
                  <Label htmlFor="new-stage-name" className="text-sm font-medium">
                    스테이지 이름 *
                  </Label>
                  <Input
                    id="new-stage-name"
                    value={deploymentData.newStageName}
                    onChange={(e) =>
                      setDeploymentData({
                        ...deploymentData,
                        newStageName: e.target.value,
                      })
                    }
                    placeholder="새 스테이지 이름을 입력하세요"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-stage-description" className="text-sm font-medium">
                    스테이지 설명
                  </Label>
                  <Textarea
                    id="new-stage-description"
                    value={deploymentData.newStageDescription}
                    onChange={(e) =>
                      setDeploymentData({
                        ...deploymentData,
                        newStageDescription: e.target.value,
                      })
                    }
                    placeholder="스테이지 설명을 입력하세요 (선택사항)"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="deploy-description" className="text-sm font-medium">
                배포 설명
              </Label>
              <Textarea
                id="deploy-description"
                value={deploymentData.description}
                onChange={(e) =>
                  setDeploymentData({
                    ...deploymentData,
                    description: e.target.value,
                  })
                }
                placeholder="배포에 대한 설명을 입력하세요"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">배포 여부</Label>
              <div>
                <span className="text-xs mr-3 text-gray-600">기본값으로 설정 여부</span>
                <Switch checked={isDirectUrlInput} onCheckedChange={setIsDirectUrlInput} />
              </div>
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={handleDeployModalClose}>
              취소
            </Button>
            <Button
              onClick={handleDeploySubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Rocket className="h-4 w-4 mr-2" />
              배포
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
