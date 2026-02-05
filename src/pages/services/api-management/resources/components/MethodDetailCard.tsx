import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Copy, ArrowRight } from 'lucide-react';
import { BasicInfoTab } from './BasicInfoTab';
import { BasicInfoEditTab } from './BasicInfoEditTab';
import { MethodRequestView } from './MethodRequestView';
import { MethodRequestEditTab } from './MethodRequestEditTab';
import { MethodTestTab } from './MethodTestTab';
import { MethodResponseTab } from './MethodResponseTab';
import { MethodResponseEditTab } from './MethodResponseEditTab';
import { DeleteMethodDialog } from './DeleteMethodDialog';
import type { TestResponse, Method, QueryParameter, RequestHeader } from '@/types/resource';
import { useClipboard } from 'use-clipboard-copy';
import { useDeleteMethod, useTestMethod } from '@/hooks/use-methods';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { getMethodStyle, HttpMethod } from '@/libs/etc';
import { useAuthStore } from '@/stores/store';
import { useGetModelList } from '@/hooks/use-model';
import { useMethodEditForm } from '../hooks/useMethodEditForm';
import { useModifyMethod } from '@/hooks/use-methods';
import { useGetEndpointsList } from '@/hooks/use-endpoints';

export default function MethodDetailCard({ selectedMethod }: { selectedMethod: Method }) {
  // info 타입 캐스팅 (Method 타입의 info가 {} 로 정의되어 있음)
  const methodInfo = selectedMethod?.info as any;

  const [activeTab, setActiveTab] = useState('basic-info');
  const [selectedFlowStep, setSelectedFlowStep] = useState('');
  const [isMethodDeleteDialogOpen, setIsMethodDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchParams] = useSearchParams();
  const apiId = searchParams.get('apiId');
  const clipboard = useClipboard();
  const userData = useAuthStore((state) => state.user);
  const userKey = userData?.userKey || '';

  const { data: modelListData } = useGetModelList(apiId, 0, 20);
  // modelList 타입 캐스팅 (API 응답이 페이지네이션 객체)
  const modelList = (modelListData as any)?.content || [];

  // endpointList 조회
  const tenantId = userData?.organizationId ?? '';
  const { data: endpointList = [] } = useGetEndpointsList(tenantId);

  const [methodToDelete, setMethodToDelete] = useState<Method | null>(null);

  // 통합 폼 상태 관리
  const {
    formData,
    updateBasicInfo,
    updateRequestSettings,
    updateResponseSettings,
    resetForm,
    getModifyMethodProps,
    integrationTypeList,
    validatorList,
    isDirty,
  } = useMethodEditForm(selectedMethod, userKey);


  // 메서드 수정 mutation
  const { mutate: modifyMethod, isPending: isModifying } = useModifyMethod({
    onSuccess: () => {
      toast.success('Method가 성공적으로 수정되었습니다.');
      setIsEditMode(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'Method 수정 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    },
  });

  // Delete Method mutation
  const { mutate: deleteMethod, isPending: isDeleting } = useDeleteMethod({
    onSuccess: () => {
      toast.success('Method가 성공적으로 삭제되었습니다.');
      setIsMethodDeleteDialogOpen(false);
      setMethodToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'Method 삭제 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    },
  });

  const handleDeleteMethod = () => {
    const methodId = methodToDelete?.info?.['x-method-id'];
    if (methodId) {
      deleteMethod(methodId);
    }
  };

  // Test Tab States
  const [testSettings, setTestSettings] = useState({
    queryString: '',
    headers: '',
    requestBody: '',
    contentType: 'application/json',
  });
  const [testResponse, setTestResponse] = useState<any>(null);

  // Test Method mutation
  const { mutate: testMethodMutate, isPending: isTestLoading } = useTestMethod({
    onSuccess: (response: any) => {
      console.log(response)
      setTestResponse(response);
      toast.success('API 테스트가 성공적으로 완료되었습니다.');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
        || error?.response?.data?.detail
        || error?.message
        || 'API 테스트 중 오류가 발생했습니다.';
      setTestResponse({
        error: true,
        message: errorMessage,
        status: error?.response?.status || 500,
        data: error?.response?.data,
      });
      toast.error(errorMessage);
    },
  });

  // selectedMethod 변경 시 편집 모드 해제
  useEffect(() => {
    setIsEditMode(false);
    setActiveTab('basic-info');
  }, [methodInfo?.['x-method-id']]);

  const handleCopyEndpoint = () => {
    clipboard.copy(methodInfo?.['x-route-endpoint'] ?? '');
    toast.success('URL이 클립보드에 복사되었습니다.');
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

  const handleCancelEdit = () => {
    resetForm();
    setIsEditMode(false);
  };

  const handleSaveMethod = () => {
    const methodId = methodInfo?.['x-method-id'];
    if (!methodId) {
      toast.error('Method ID not found.');
      return;
    }

    modifyMethod({
      methodId,
      data: getModifyMethodProps(),
    });
  };

  const handleTest = (requestBody: any) => {
    const methodId = methodInfo?.['x-method-id'];
    if (!methodId) {
      toast.error('Method ID not found.');
      return;
    }
    testMethodMutate({ methodId, data: requestBody });
  };

  console.log(selectedMethod)

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Method Header */}
        <div className="p-6">
          <div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-all">
                  <span
                    className={`${getMethodStyle(selectedMethod.type as HttpMethod)} !font-mono !font-bold !text-xl !px-1.5 !py-0.5 rounded mr-2`}>
                    {selectedMethod.type}
                  </span>{' '}
                  {selectedMethod.resourcePath}
                </h1>
                <div className="flex items-center gap-2">
                  {!isEditMode ? (
                    <>
                      <Button
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={handleEditMethod}>
                        편집
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
                        onClick={() => {
                          setMethodToDelete(selectedMethod);
                          setIsMethodDeleteDialogOpen(true);
                        }}>
                        삭제
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleCancelEdit} disabled={isModifying}>
                        취소
                      </Button>
                      <Button
                        onClick={handleSaveMethod}
                        disabled={isModifying}
                        className="bg-blue-500 hover:bg-blue-600 text-white">
                        {isModifying ? '저장 중...' : '저장'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="w-[100%] mt-2">
                <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6 w-[100%] mt-6">
                  <div className="flex items-center justify-between">
                    {/* Client */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white border-2 border-blue-300 rounded-lg flex items-center justify-center mb-2">
                        <Monitor className="h-6 w-6 text-gray-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Client
                      </span>
                    </div>

                    <div className="space-y-3">
                      <ArrowLeft className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                      <ArrowRight className="h-4 w-4 text-gray-400 rotate-180 mx-2" />
                    </div>

                    {/* Method Request & Response */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center cursor-pointer transition-all mb-2 ${selectedFlowStep === 'method-request'
                          ? 'bg-blue-200 dark:bg-blue-800'
                          : ''
                          }`}
                        onClick={() => handleFlowStepClick('method-request')}>
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Method 요청
                        </div>
                      </div>

                      <div
                        className={`bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-center cursor-pointer transition-all ${selectedFlowStep === 'method-response'
                          ? 'bg-blue-200 dark:bg-blue-800'
                          : ''
                          }`}
                        onClick={() => handleFlowStepClick('method-response')}>
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Method 응답
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
                          <div className="text-xs font-bold text-gray-600">{selectedMethod?.info?.['x-integration-type']}</div>
                          {/* <div className="text-xs text-gray-500">Response</div> */}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {selectedMethod?.info?.['x-integration-type']} 응답
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
            <TabsList className={`grid w-full ${['GET', 'PUT', 'POST'].includes(selectedMethod.type) && selectedMethod?.info?.['x-integration-type'] !== 'MOCK' ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <TabsTrigger value="basic-info">Method 기본 정보</TabsTrigger>
              <TabsTrigger value="method-request">Method 요청</TabsTrigger>
              <TabsTrigger value="method-response">Method 응답</TabsTrigger>
              {['GET', 'PUT', 'POST'].includes(selectedMethod.type) && selectedMethod?.info?.['x-integration-type'] !== 'MOCK' && (
                <TabsTrigger value="test">테스트</TabsTrigger>
              )}
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic-info" className="space-y-6 mt-6">
              {!isEditMode ? (
                <BasicInfoTab selectedMethod={selectedMethod} handleCopyEndpoint={handleCopyEndpoint} />
              ) : (
                <BasicInfoEditTab
                  formData={formData}
                  integrationTypeList={integrationTypeList}
                  onChange={updateBasicInfo}
                  selectedMethod={selectedMethod}
                  endpointList={endpointList}
                />
              )}
            </TabsContent>

            {/* Method Request Tab */}
            <TabsContent value="method-request" className="space-y-6 mt-6">
              {!isEditMode ? (
                <MethodRequestView
                  selectedMethod={selectedMethod}
                  queryParameters={formData.queryParameters.map((p, idx) => ({
                    id: `query-${idx}`,
                    name: p.name,
                    description: p.description,
                    type: p.schema?.type || 'string',
                    required: p.required,
                    cacheKey: false,
                  }))}
                  requestHeaders={formData.headerParameters.map((p, idx) => ({
                    id: `header-${idx}`,
                    name: p.name,
                    description: p.description,
                    type: p.schema?.type || 'string',
                    required: p.required,
                  }))}
                  modelId={formData.requestBodyConfig.modelId}
                />
              ) : (
                <MethodRequestEditTab
                  formData={formData}
                  validatorList={validatorList}
                  modelList={modelList || []}
                  httpMethod={selectedMethod.type}
                  onChange={updateRequestSettings}
                />
              )}
            </TabsContent>

            {/* Method Response Tab */}
            <TabsContent value="method-response" className="space-y-6 mt-6">
              {!isEditMode ? (
                <MethodResponseTab
                  methodResponses={formData.responses.map((r, idx) => ({
                    id: `response-${idx}`,
                    statusCode: r.statusCode,
                    description: r.description,
                    headers: r.headers,
                    bodies: r.modelId
                      ? [{ id: `body-${idx}`, contentType: 'application/json', model: r.modelId }]
                      : [],
                  }))}
                />
              ) : (
                <MethodResponseEditTab
                  formData={formData}
                  modelList={modelList || []}
                  onChange={updateResponseSettings}
                />
              )}
            </TabsContent>

            {/* Enhanced Test Tab - Only for GET, PUT, POST methods and non-MOCK integration */}
            {['GET', 'PUT', 'POST'].includes(selectedMethod.type) && selectedMethod?.info?.['x-integration-type'] !== 'MOCK' && (
              <TabsContent value="test" className="space-y-6 mt-6">
                <MethodTestTab
                  selectedMethod={selectedMethod}
                  handleTest={handleTest}
                  isTestLoading={isTestLoading}
                  testResponse={testResponse}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Delete Method Confirmation Dialog */}
      <DeleteMethodDialog
        open={isMethodDeleteDialogOpen}
        onOpenChange={setIsMethodDeleteDialogOpen}
        methodToDelete={methodToDelete}
        isPending={isDeleting}
        onDeleteMethod={handleDeleteMethod}
      />
    </>
  );
}
