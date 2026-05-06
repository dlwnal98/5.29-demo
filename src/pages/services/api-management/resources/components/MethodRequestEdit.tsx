import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, Trash2, CheckCircle } from 'lucide-react';
import type { QueryParameter, RequestHeader } from '@/types/resource';
import { toast, Toaster } from 'sonner';
import RequestHeaderListSearch from '../../models/components/RequestHeaderListSearch';
import { SelectAPIKeyModal } from '../methods/components/SelectAPIKeyModal';
import { useAuthStore } from '@/stores/store';
import { useGetAPIKeyList } from '@/hooks/use-apiKeys';
import { Method } from '@/types/resource';
import { requestGet } from '@/libs/request';
import { useClipboard } from 'use-clipboard-copy';
import { Header } from '@/types/methods';
import { useModifyMethod } from '@/hooks/use-methods';
import { useMethodEditStore } from '@/stores/store';
import { ModelData } from '@/apis/models.api';
import { getValidatorList } from '@/apis/methods.api'

interface MethodRequestEditProps {
  selectedMethod: Method;
  modelList: ModelData[];
}

export function MethodRequestEdit({ selectedMethod, modelList }: MethodRequestEditProps) {
  const userData = useAuthStore((state) => state.user);
  const setIsEditMode = useMethodEditStore((state) => state.setIsEdit);
  const clipboard = useClipboard();
  const tenantId = userData?.organizationId || "kvwwwksAsvmas";

  const { data: apiKeyList } = useGetAPIKeyList(tenantId);

  const { mutate: modifyMethod } = useModifyMethod({
    onSuccess: () => {
      toast.success('Method 요청 설정이 성공적으로 수정되었습니다.');
      setIsEditMode(false);
    },
    onError: (error: any) => {
      // const errorMessage = error?.response?.data?.message
      //   || error?.response?.data?.detail
      //   || error?.message
      //   || 'Method 요청 설정 수정 중 오류가 발생했습니다.';
      // toast.error(errorMessage);
      toast.error(error.message)
    },
  });

  const [validatorList, setValidatorList] = useState([]);

  const handleValidatorList = async () => {
    const res = await getValidatorList();

    return setValidatorList(res);
  };



  useEffect(() => {
    handleValidatorList();
  }, []);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState('');
  const [isCreatingNewApiKey, setIsCreatingNewApiKey] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState({
    name: '',
    description: '',
  });
  const [apiKeyContent, setApiKeyContent] = useState('');

  const [methodEditForm, setMethodEditForm] = useState({
    selectedApiKeyValue: '',
    requestValidator: 'NONE',
  });
  const [apiKeyToggle, setApiKeyToggle] = useState(false);

  const [openId, setOpenId] = useState<string | null>(null);
  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([]);
  const [requestHeaders, setRequestHeaders] = useState<RequestHeader[]>([]);
  const [requestModelId, setRequestModelId] = useState<string>('');

  useEffect(() => {
    if (selectedMethod) {
      setApiKeyToggle(selectedMethod?.info['x-api-key-required']);
      setSelectedApiKeyId(selectedMethod?.info['x-api-key-id'] || '');
      setMethodEditForm({
        selectedApiKeyValue: selectedMethod?.info['x-api-key-id'],
        requestValidator: selectedMethod?.info['x-request-validator'],
      });

      if (selectedMethod.info.parameters) {
        setQueryParameters(
          selectedMethod.info.parameters
            .filter((param: any) => param.in === 'query')
            .map((param: any, idx: number) => ({
              ...param,
              id: param.id ?? `query-${idx}`, // 기존에 id 없으면 새로 부여
            }))
        );
        setRequestHeaders(
          selectedMethod?.info?.parameters
            ?.filter((param: any) => param.in === 'header')
            .map((param: any, idx: number) => ({
              ...param,
              id: param.id ?? `header-${idx}`, // 기존에 id 없으면 새로 부여
            }))
        );
      }
      // 요청 본문 모델 ID 추출 (x-model-id 필드 사용)
      let modelId = '';
      // 1. 메서드 레벨에서 x-model-id 확인
      if (selectedMethod.info['x-model-id']) {
        modelId = selectedMethod.info['x-model-id'];
      }
      // 2. requestBody 레벨에서 x-model-id 확인
      else if (selectedMethod.info.requestBody?.['x-model-id']) {
        modelId = selectedMethod.info.requestBody['x-model-id'];
      }
      // 3. requestBody에서 $ref 파싱
      else if (selectedMethod.info.requestBody) {
        const ref = selectedMethod.info.requestBody?.content?.['application/json']?.schema?.$ref;
        if (ref) {
          const match = ref.match(/\/schemas\/([^\/]+)$/);
          modelId = match ? match[1] : '';
        }
      }
      setRequestModelId(modelId);
    }
  }, [selectedMethod]);

  useEffect(() => {
    if (apiKeyList && selectedMethod) {
      const existingAPIKeyData = apiKeyList.filter(
        (key, i) => key.keyId === selectedMethod?.info['x-api-key-id']
      );

      setApiKeyContent(existingAPIKeyData[0]?.key);
    }
  }, [apiKeyList, isApiKeyModalOpen]);

  const handleApiKeyToggle = (checked: boolean) => {
    if (checked) {
      setIsApiKeyModalOpen(true);
    } else {
      setApiKeyToggle(false);
    }
  };

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

  const nextHeaderIdRef = useRef<number>(0);
  // 추가: 생성순으로 id 부여
  const addRequestHeader = () => {
    const newHeader: Header = {
      id: nextHeaderIdRef.current++,
      name: '',
      required: false,
    };
    // functional update 사용 (안전)
    setRequestHeaders((prev) => [...prev, newHeader]);
  };

  const updateRequestHeader = (id: string, field: keyof Header, value: any) => {
    setRequestHeaders(
      requestHeaders.map((header) => (header.id === id ? { ...header, [field]: value } : header))
    );
  };

  // 삭제
  const removeRequestHeader = (id: number) => {
    setRequestHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  // 비밀번호 복사 함수
  const handleCopyAPIKey = (apiKey: string) => {
    clipboard.copy(apiKey);
    toast.success('API Key copied to clipboard.');
  };
  const formattedQueryParameters = queryParameters.map((param) => ({
    name: param.name,
    required: param.required,
  }));

  const formattedHeaderParameters = requestHeaders.map((header) => ({
    name: header.name,
    required: header.required,
  }));

  const handleModifyMedthod = () => {
    if (!selectedMethod) return;

    const methodId = selectedMethod.info['x-method-id'];

    modifyMethod({
      methodId,
      data: {
        methodName: selectedMethod.info.summary,
        description: selectedMethod.info.description,
        backendServiceUrl: selectedMethod.info['x-route-endpoint'],
        queryParameters: formattedQueryParameters,
        headerParameters: formattedHeaderParameters,
        enabled: true,
        requestValidator: methodEditForm.requestValidator,
        apiKeyRequired: apiKeyToggle,
        updatedBy: userData?.userKey,
        apiKeyId: selectedApiKeyId,
        requestModelId: requestModelId,
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Method Request Edit</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditMode(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleModifyMedthod}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              Save
            </Button>
          </div>
        </div>
        {/* Method Request Settings Edit */}
        <Card className="!mt-3">
          <CardHeader>
            <CardTitle className="!text-lg">Method Request Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">API Key Required</Label>
              <Switch checked={apiKeyToggle} onCheckedChange={handleApiKeyToggle} />
            </div>
            {apiKeyToggle && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        Selected API Key
                      </h4>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                        Activated
                      </span>
                      <button
                        className="hover:underline"
                        onClick={() => handleCopyAPIKey(apiKeyContent)}>
                        <Copy className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                    <p className="text-red-500 text-xs mb-2">
                      Add the X-API-Key field to your HTTP(S) header and include the copied key value in your request.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <div>
                <Label className="text-sm font-medium">Request Validator</Label>
                <Select
                  value={methodEditForm?.requestValidator}
                  onValueChange={(value) =>
                    setMethodEditForm({ ...methodEditForm, requestValidator: value })
                  }>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {validatorList.map((validator, i) => (
                      <SelectItem key={i} value={validator?.code} className="hover:cursor-pointer">
                        {validator?.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* URL Query String Parameters Edit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center !text-lg  gap-3">
              URL Query String Parameters
              <Button
                size="sm"
                variant={'outline'}
                className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                onClick={addQueryParameter}>
                <span className="font-bold">Add</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {queryParameters.map((param) => (
                <div key={param.id} className="grid grid-cols-12 gap-4 items-center mb-3">
                  <div className="col-span-10">
                    <Input
                      value={param.name}
                      onChange={(e) => updateQueryParameter(param.id, 'name', e.target.value)}
                      placeholder="Parameter Name"
                    />
                  </div>
                  <div className="col-span-2 gap-1 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Label className="text-xs">Required</Label>
                      <Switch
                        checked={param.required}
                        onCheckedChange={(checked) =>
                          updateQueryParameter(param.id, 'required', checked)
                        }
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-0 hover:bg-transparent bg-transparent cursor-pointer"
                      onClick={() => removeQueryParameter(param.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              {queryParameters.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No query parameters. Click the Add button to add a new parameter.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* HTTP Request Headers Edit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center  gap-3 !text-lg">
              HTTP Request Headers
              <Button
                size="sm"
                variant={'outline'}
                className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                onClick={addRequestHeader}>
                <span className="font-bold">Add</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requestHeaders.map((header) => (
                <div
                  key={header.id}
                  className={`grid grid-cols-12 gap-3 mt-3 ${openId === header.id ? 'items-start' : 'items-center  mb-3'}`}>
                  <div className="col-span-10">
                    <RequestHeaderListSearch
                      updateHeader={(field, value) => updateRequestHeader(header.id, field, value)}
                      key={header.id}
                      isOpen={openId === header.id}
                      setIsOpen={(val) => setOpenId(val ? header.id : null)}
                      existingSearch={header.name}
                    />
                  </div>
                  <div
                    className={`col-span-2 gap-1 flex items-center ${openId === header.id ? 'mt-1' : ''}`}>
                    <div className="flex items-center space-x-2">
                      <Label className="text-xs">Required</Label>
                      <Switch
                        checked={header.required}
                        onCheckedChange={(checked) =>
                          updateRequestHeader(header.id, 'required', checked)
                        }
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeRequestHeader(header.id)}
                      className="border-0 hover:bg-transparent bg-transparent cursor-pointer">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
              {requestHeaders.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No request headers. Click the Add button to add a new request header.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Request Body Edit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 !text-lg">Request Body</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3 items-center mb-3">
                <div className="col-span-10">
                  <Select
                    value={requestModelId}
                    disabled={modelList?.length === 0}
                    onValueChange={(value) => {
                      setRequestModelId(value);
                    }}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          modelList?.length > 0 ? 'Select Model' : 'No models available.'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {modelList.map((model) => (
                        <SelectItem key={model.modelId} value={model.modelId}>
                          {model.modelName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex justify-start">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-0 hover:bg-transparent bg-transparent cursor-pointer"
                    disabled={modelList?.length === 0}
                    onClick={() => setRequestModelId('')}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
          tenantId={tenantId}
          setApiKeyToggle={setApiKeyToggle}
          setSelectedApiKeyValue={setApiKeyContent}
        />
      </div>
    </>
  );
}
