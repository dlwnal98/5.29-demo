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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, ChevronDown, ChevronRight, Globe, Trash2, CheckCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { QueryParameter, Header, BodyModel, Model } from '@/types/methods';
import RequestHeaderListSearch from '../../models/components/RequestHeaderListSearch';
import { useAuthStore } from '@/store/store';
import { useGetAPIKeyList } from '@/hooks/use-apiKeys';
import { SelectAPIKeyModal } from './components/SelectAPIKeyModal';
import { exampleMethodList, checkerOptionList } from '@/lib/data';
import { useCreateMethod } from '@/hooks/use-methods';
import { useGetModelList } from '@/hooks/use-model';
import { useGetEndpointsList } from '@/hooks/use-endpoints';
import { requestGet } from '@/lib/apiClient';

export default function CreateMethodPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resourceId = searchParams.get('resourceId');
  const resourcePath = searchParams.get('resourcePath');
  const userData = useAuthStore((state) => state.user);

  const { data: apiKeyList } = useGetAPIKeyList(userData?.organizationId || '');
  const { data: endpointList } = useGetEndpointsList(userData?.organizationId || '');
  // const {data : modelList} = useGetModelList('dasdf'); // API Id 들어가야함

  console.log(endpointList);

  const { mutate: createMethod } = useCreateMethod({
    onSuccess: () => {
      toast.success('메서드가 성공적으로 생성되었습니다.');
      handleBack();
    },
    onError: () => {
      toast.error('메서드 생성에 실패하였습니다.');
    },
  });

  const [methodForm, setMethodForm] = useState({
    methodName: '',
    description: '',
    methodType: '',
    integrationType: 'http',
    apiKeyRequired: false,
    selectedApiKey: '',
    endpointUrl: '',
    additionalParameter: '',
    customEndpointUrl: '',
    requestValidator: 'NONE',
  });

  const [modelList, setModelList] = useState<Model[]>([
    {
      modelId: '',
      modelName: 'User',
      description: '사용자 정보 모델',
      apiId: '',
      modelType: '',
      enabled: true,
      createdAt: '',
      createdBy: '',
    },
  ]);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isDirectUrlInput, setIsDirectUrlInput] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState('');
  const [apiKeyToggle, setApiKeyToggle] = useState(false);
  const [isCreatingNewApiKey, setIsCreatingNewApiKey] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState({
    name: '',
    description: '',
  });

  // 기본값을 모두 false로 설정 (닫힌 상태)
  const [openSections, setOpenSections] = useState({
    methodRequest: false,
    urlQuery: false,
    httpHeaders: false,
    requestBody: false,
  });

  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([]);

  const [headers, setHeaders] = useState<Header[]>([]);

  const [bodyModels, setBodyModels] = useState<BodyModel[]>([
    {
      id: '1',
      name: '',
      description: '',
      model: '',
    },
  ]);

  const [validatorList, setValidatorList] = useState([]);

  const getValidatorList = async (codeType = 'REQUEST_VALIDATOR') => {
    const res = await requestGet(`/api/v1/common-codes/${codeType}`);

    return setValidatorList(res);
  };

  useEffect(() => {
    getValidatorList();
  }, []);

  const handleBack = () => {
    router.push(`/services/api-management/resources?resourceId=${resourceId}`);
  };

  const handleCreateMethod = () => {
    if (!methodForm.methodType) {
      toast.error('메서드 유형을 선택해주세요.');
      return;
    }

    if (methodForm.integrationType === 'http' && !methodForm.methodType) {
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

    createMethod({
      resourceId: resourceId || '',
      createdBy: userData?.userKey || '',
      httpMethod: methodForm.methodType,
      methodName: methodForm.methodName,
      description: methodForm.description,
      apiKeyId: selectedApiKeyId,
      requiresApiKey: apiKeyToggle,
      backendServiceUrl: methodForm.customEndpointUrl
        ? methodForm.customEndpointUrl
        : methodForm.endpointUrl + methodForm.additionalParameter,
      // requestModelIds: [],
      // responseModelId: '',
      queryParameters: queryParameters,
      headerParameters: headers,
      requestValidator: methodForm.requestValidator,
    });
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

  const handleModelSelect = (modelId: string) => {};

  // const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([]);
  const [paramCounter, setParamCounter] = useState(0); // 순차 id 관리용

  const addQueryParameter = () => {
    const newParam: QueryParameter = {
      id: (paramCounter + 1).toString(), // 고유하고 순차적인 id
      name: '',
      required: false,
    };
    setQueryParameters((prev) => [...prev, newParam]);
    setParamCounter((prev) => prev + 1);
  };

  const updateQueryParameter = (id: string, field: keyof QueryParameter, value: any) => {
    setQueryParameters((prev) =>
      prev.map((param) => (param.id === id ? { ...param, [field]: value } : param))
    );
  };

  const removeQueryParameter = (id: string) => {
    setQueryParameters((prev) => prev.filter((param) => param.id !== id));
  };

  console.log(queryParameters);

  const nextHeaderIdRef = useRef<number>(0);
  // 추가: 생성순으로 id 부여
  const addHeader = () => {
    const id = nextHeaderIdRef.current++;
    const newHeader: Header = {
      id,
      name: '',
      required: false,
    };
    // functional update 사용 (안전)
    setHeaders((prev) => [...prev, newHeader]);
  };

  // 수정: id 기준으로 업데이트
  // const updateHeader = (id: number, field: keyof Header, value: any) => {
  //   setHeaders((prev) => prev.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  // };

  const updateHeader = (id: string, field: keyof Header, value: any) => {
    setHeaders(
      headers.map((header) => (header.id === id ? { ...header, [field]: value } : header))
    );
  };

  // 삭제
  const removeHeader = (id: number) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  console.log(headers);

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

  // Get selected API key info
  const selectedApiKeyInfo = apiKeyList?.find((key) => key.keyId === methodForm.selectedApiKey);

  const [openId, setOpenId] = useState<string | null>(null);

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
        <div className="flex items-center justify-between mb-3">
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
              className="bg-orange-500 hover:bg-orange-600 text-white">
              저장
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <Card>
              <div className="pt-7"></div>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-method-name" className="text-[16px] font-semibold mb-4">
                      메서드 이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="new-method-name"
                      placeholder="예 : 사용자 정보 조회"
                      value={methodForm.methodName}
                      onChange={(e) => setMethodForm({ ...methodForm, methodName: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="new-method-description"
                      className="text-[16px] font-semibold mb-4">
                      설명
                    </Label>
                    <Textarea
                      id="new-method-description"
                      placeholder="메서드에 대한 설명을 입력하세요"
                      value={methodForm.description}
                      onChange={(e) =>
                        setMethodForm({ ...methodForm, description: e.target.value })
                      }
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="method-type" className="text-[16px] font-semibold mb-4">
                        메서드 유형 <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={methodForm.methodType}
                        onValueChange={(value) =>
                          setMethodForm({ ...methodForm, methodType: value })
                        }>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="메서드 유형 선택" />
                        </SelectTrigger>
                        <SelectContent className="hover:cursor-pointer">
                          {exampleMethodList.map((method, i) => (
                            <SelectItem className="hover:cursor-pointer" value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[16px] font-semibold mb-4">
                    통합 유형 <span className="text-red-500">*</span>
                  </h3>
                  <RadioGroup
                    value={methodForm.integrationType}
                    onValueChange={(value) =>
                      setMethodForm({ ...methodForm, integrationType: value })
                    }
                    className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-4">
                    {/* HTTP */}
                    <div
                      className={`grid-cols-1 border rounded-lg p-4 transition-all ${
                        methodForm.integrationType === 'http'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="http" id="http" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Globe className="h-8 w-8 text-blue-500" />
                            <div>
                              <Label
                                htmlFor="http"
                                className="text-base font-medium cursor-pointer">
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

                {methodForm.integrationType === 'http' && (
                  <div className="space-y-6">
                    {/* API Key Toggle */}
                    <div className="">
                      <div className="flex items-center mb-3 gap-3">
                        <div>
                          <Label className="text-[16px] font-semibold mb-4">API Key 설정</Label>
                        </div>
                        <Switch checked={apiKeyToggle} onCheckedChange={handleApiKeyToggle} />
                      </div>

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

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Label className="text-[16px] font-semibold">
                          엔드포인트 URL <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-600">직접 입력</Label>
                          <Switch
                            checked={isDirectUrlInput}
                            onCheckedChange={setIsDirectUrlInput}
                          />
                        </div>
                      </div>

                      {isDirectUrlInput ? (
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
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={methodForm.endpointUrl}
                            onValueChange={(value) =>
                              setMethodForm({ ...methodForm, endpointUrl: value })
                            }>
                            <SelectTrigger>
                              <SelectValue placeholder="엔드포인트 URL 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {endpointList?.map((url, id) => (
                                <SelectItem
                                  key={id}
                                  value={url.targetEndpoint}
                                  className="hover:cursor-pointer">
                                  {url.targetEndpoint}
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
                        }>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {validatorList.map((checker, i) => (
                            <SelectItem className="hover:cursor-pointer" value={checker.code}>
                              {checker.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {/* URL Query String Parameters */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Collapsible
                open={openSections.urlQuery}
                onOpenChange={() => toggleSection('urlQuery')}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/30 border-0 rounded-none">
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
                      <div className=" dark:bg-blue-950/20 rounded-lg">
                        <h4 className="flex items-center gap-3 font-semibold text-gray-900 dark:text-blue-100 mb-4">
                          쿼리 스트링
                          <Button
                            size="sm"
                            variant={'outline'}
                            className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                            onClick={addQueryParameter}>
                            <span className="font-bold">추가</span>
                          </Button>
                        </h4>
                        {queryParameters.length == 0 ? (
                          <p className="text-sm text-gray-500">쿼리 파라미터를 찾을 수 없습니다.</p>
                        ) : (
                          <>
                            {queryParameters.map((param, index) => (
                              <div
                                key={param.id}
                                className="grid grid-cols-12 gap-4 items-center mb-3">
                                <div className="col-span-10">
                                  <Input
                                    placeholder="이름"
                                    value={param.name}
                                    onChange={(e) =>
                                      updateQueryParameter(param.id, 'name', e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-span-2 gap-1 flex items-center">
                                  <div className="flex items-center space-x-2">
                                    <Label className="text-xs">필수</Label>
                                    <Switch
                                      checked={param.required}
                                      onCheckedChange={(checked) =>
                                        updateQueryParameter(param.id, 'required', checked)
                                      }
                                      size="sm"
                                    />
                                  </div>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-0 hover:bg-transparent cursor-pointer"
                                    onClick={() => removeQueryParameter(param.id)}>
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </>
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
                onOpenChange={() => toggleSection('httpHeaders')}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/30 border-0 rounded-none">
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
                      <div className="dark:bg-green-950/20 rounded-lg">
                        <h4 className="flex items-center gap-3 font-semibold text-gray-900 dark:text-green-100 mb-4">
                          헤더
                          <Button
                            size="sm"
                            variant={'outline'}
                            className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                            onClick={addHeader}>
                            <span className="font-bold">추가</span>
                          </Button>
                        </h4>
                        {headers.length === 0 ? (
                          <p className="text-sm text-gray-500">헤더를 찾을 수 없습니다.</p>
                        ) : (
                          <>
                            {headers.map((header) => (
                              <div
                                key={header.id}
                                className={`grid grid-cols-12 gap-3 mt-3 ${openId === header.id ? 'items-start' : 'items-center mb-3'}`}>
                                <div className="col-span-10">
                                  <RequestHeaderListSearch
                                    isOpen={openId === header.id}
                                    setIsOpen={(val) => setOpenId(val ? header.id : null)}
                                    updateHeader={(field, value) =>
                                      updateHeader(header.id, field, value)
                                    }
                                  />
                                </div>

                                <div
                                  className={`col-span-2 gap-1 flex items-center ${openId === header.id ? 'mt-1' : ''}`}>
                                  <div className="flex items-center space-x-2">
                                    <Label className="text-xs">필수</Label>
                                    <Switch
                                      checked={header.required}
                                      onCheckedChange={(checked) =>
                                        updateHeader(header.id, 'required', checked)
                                      }
                                      size="sm"
                                    />
                                  </div>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-0 hover:bg-transparent cursor-pointer"
                                    onClick={() => removeHeader(header.id)}>
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
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
                onOpenChange={() => toggleSection('requestBody')}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 border-0 rounded-none">
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
                    <div className="dark:bg-orange-950/20 rounded-lg">
                      <h4 className="flex items-center gap-3 font-semibold text-gray-900 dark:text-green-100 mb-4">
                        요청 모델
                        <Button
                          size="sm"
                          variant={'outline'}
                          className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                          onClick={addBodyModel}>
                          <span className="font-bold">추가</span>
                        </Button>
                      </h4>
                      {bodyModels.length == 0 ? (
                        <p className="text-sm text-gray-500">모델을 찾을 수 없습니다.</p>
                      ) : (
                        <>
                          {bodyModels.map((model, index) => (
                            <div
                              key={model.id}
                              className="grid grid-cols-12 gap-3 items-center mb-3">
                              <div className="col-span-5">
                                <Input
                                  placeholder="콘텐츠 유형"
                                  value={model.name}
                                  onChange={(e) =>
                                    updateBodyModel(model.id, 'name', e.target.value)
                                  }
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
                                  }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="모델" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {modelList.map((availableModel, i) => (
                                      <SelectItem
                                        key={i}
                                        value={availableModel.modelName}
                                        className="hover:cursor-pointer">
                                        {availableModel.modelName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-2 flex justify-start">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-0 hover:bg-transparent cursor-pointer"
                                  onClick={() => removeBodyModel(model.id)}>
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Enhanced API Key Selection Modal */}
        <SelectAPIKeyModal
          open={isApiKeyModalOpen}
          onOpenChange={setIsApiKeyModalOpen}
          isCreatingNewApiKey={isCreatingNewApiKey}
          setIsCreatingNewApiKey={setIsCreatingNewApiKey}
          apiKeyList={apiKeyList || []}
          selectedApiKeyId={selectedApiKeyId}
          setSelectedApiKeyId={setSelectedApiKeyId}
          newApiKeyForm={newApiKeyForm}
          setNewApiKeyForm={setNewApiKeyForm}
          userKey={userData?.userKey || ''}
          setApiKeyToggle={setApiKeyToggle}
        />
      </div>
    </AppLayout>
  );
}
