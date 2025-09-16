'use client';

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
import type { QueryParameter, RequestHeader, RequestBodyModel, Model } from '@/types/resource';
import { toast } from 'sonner';
import RequestHeaderListSearch from '../../models/components/RequestHeaderListSearch';
import { SelectAPIKeyModal } from '../methods/components/SelectAPIKeyModal';
import { useAuthStore } from '@/store/store';
import { useGetAPIKeyList } from '@/hooks/use-apiKeys';
import { Method } from '@/types/resource';
import { requestGet } from '@/lib/apiClient';
import { useClipboard } from 'use-clipboard-copy';
import { Header } from '@/types/methods';

interface MethodRequestEditProps {
  selectedMethod: Method;
  handleCancelEdit: () => void;
  handleSaveEdit: () => void;
}

export function MethodRequestEdit({
  selectedMethod,
  handleCancelEdit,
  handleSaveEdit,
}: MethodRequestEditProps) {
  const userData = useAuthStore((state) => state.user);

  const { data: apiKeyList } = useGetAPIKeyList(userData?.organizationId || '');

  const [validatorList, setValidatorList] = useState([]);

  const getValidatorList = async (codeType = 'REQUEST_VALIDATOR') => {
    const res = await requestGet(`/api/v1/common-codes/${codeType}`);

    return setValidatorList(res);
  };

  useEffect(() => {
    getValidatorList();
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
    selectedApiKey: '',
    requestValidator: 'NONE',
  });
  const [apiKeyToggle, setApiKeyToggle] = useState(false);

  const [openId, setOpenId] = useState<string | null>(null);
  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([]);
  const [requestHeaders, setRequestHeaders] = useState<RequestHeader[]>([]);
  const [requestBodyModels, setRequestBodyModels] = useState<RequestBodyModel[]>([]);

  useEffect(() => {
    if (selectedMethod) {
      setApiKeyToggle(selectedMethod?.info['x-api-key-required']);
      setMethodEditForm({
        selectedApiKey: selectedMethod?.info['x-api-key-id'],
        requestValidator: selectedMethod?.info['x-request-validator'],
      });

      if (selectedMethod.info.parameters) {
        setQueryParameters(
          selectedMethod?.info?.parameters?.filter((param: any) => param.in === 'query')
        );
        setRequestHeaders(
          selectedMethod?.info?.parameters?.filter((param: any) => param.in === 'header')
        );
      }
    }
  }, [selectedMethod]);

  console.log(queryParameters);

  useEffect(() => {
    if (apiKeyList && selectedMethod) {
      const existingAPIKeyData = apiKeyList.filter(
        (key, i) => key.keyId === selectedMethod?.info['x-api-key-id']
      );
      console.log(existingAPIKeyData);

      setApiKeyContent(existingAPIKeyData[0]?.key);
    }
  }, [apiKeyList]);

  const handleApiKeyToggle = (checked: boolean) => {
    if (checked) {
      setIsApiKeyModalOpen(true);
    } else {
      setApiKeyToggle(false);
    }
  };

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
  const addRequestHeader = () => {
    const id = nextHeaderIdRef.current++;
    const newHeader: Header = {
      id,
      name: '',
      required: false,
    };
    // functional update 사용 (안전)
    setRequestHeaders((prev) => [...prev, newHeader]);
  };

  const updateHeader = (id: string, field: keyof Header, value: any) => {
    setRequestHeaders(
      requestHeaders.map((header) => (header.id === id ? { ...header, [field]: value } : header))
    );
  };

  // 삭제
  const removeHeader = (id: number) => {
    setRequestHeaders((prev) => prev.filter((h) => h.id !== id));
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

  const clipboard = useClipboard();

  // 비밀번호 복사 함수
  const handleCopyAPIKey = (apiKey: string) => {
    clipboard.copy(apiKey);
    toast.success('API Key가 복사되었습니다.');
  };

  console.log(apiKeyToggle, newApiKeyForm, methodEditForm, selectedMethod);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">메서드 요청 편집</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancelEdit}>
            취소
          </Button>
          <Button onClick={handleSaveEdit} className="bg-blue-500 hover:bg-blue-600 text-white">
            저장
          </Button>
        </div>
      </div>
      {/* Method Request Settings Edit */}
      <Card className="!mt-3">
        <CardHeader>
          <CardTitle className="!text-lg">메서드 요청 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">API 키가 필요함</Label>
            <Switch checked={apiKeyToggle} onCheckedChange={handleApiKeyToggle} />
          </div>
          {apiKeyToggle && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-green-900 dark:text-green-100">
                      선택된 API 키
                    </h4>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                      활성화됨
                    </span>
                    <button
                      className="hover:underline"
                      onClick={() => handleCopyAPIKey(apiKeyContent)}>
                      <Copy className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                      {apiKeyContent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            <div>
              <Label className="text-sm font-medium">요청 검사기</Label>
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
            URL 쿼리 문자열 파라미터
            <Button
              size="sm"
              variant={'outline'}
              className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
              onClick={addQueryParameter}>
              <span className="font-bold">추가</span>
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
                    placeholder="파라미터 이름"
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
              <div className="text-center py-6 text-gray-500">
                쿼리 파라미터가 없습니다. 추가 버튼을 클릭하여 새 파라미터를 추가하세요.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* HTTP Request Headers Edit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center  gap-3 !text-lg">
            HTTP 요청 헤더
            <Button
              size="sm"
              variant={'outline'}
              className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
              onClick={addRequestHeader}>
              <span className="font-bold">추가</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requestHeaders.map((header) => (
              <div
                key={header.id}
                // className="grid grid-cols-12 gap-3 mt-3 items-center">
                className={`grid grid-cols-12 gap-3 mt-3 ${openId === header.id ? 'items-start' : 'items-center  mb-3'}`}>
                <div className="col-span-10">
                  <RequestHeaderListSearch
                    // updateHeader={updateRequestHeader}
                    updateHeader={(field, value) => updateRequestHeader(header.id, field, value)}
                    key={header.id}
                    isOpen={openId === header.id}
                    setIsOpen={(val) => setOpenId(val ? header.id : null)}
                  />
                </div>
                <div
                  className={`col-span-2 gap-1 flex items-center ${openId === header.id ? 'mt-1' : ''}`}>
                  {/* className={`col-span-2 gap-1 flex items-center mt-1`}> */}
                  <div className="flex items-center space-x-2">
                    <Label className="text-xs">필수</Label>
                    <Switch
                      checked={header.required}
                      onCheckedChange={(checked) =>
                        updateRequestHeader(header.id, 'required', checked)
                      }
                      // disabled={header.name === 'Content-Type'}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeRequestHeader(header.id)}
                    className="border-0 hover:bg-transparent bg-transparent cursor-pointer"
                    // disabled={header.name === 'Content-Type'}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
            {requestHeaders.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                요청 헤더가 없습니다. 추가 버튼을 클릭하여 새로운 요청 헤더를 추가하세요.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Request Body Edit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 !text-lg">
            요청 본문
            <Button
              size="sm"
              variant={'outline'}
              className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
              onClick={addRequestBodyModel}>
              <span className="font-bold">추가</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requestBodyModels.map((model) => (
              <div key={model.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                <div className="col-span-5">
                  <Input
                    value={model.modelName}
                    onChange={(e) => updateRequestBodyModel(model.id, 'modelName', e.target.value)}
                    placeholder="콘텐츠 유형"
                  />
                </div>
                <div className="col-span-5">
                  <Select
                    value={model.modelId}
                    onValueChange={(value) => {
                      const selectedModel = availableModels.find((m) => m.id === value);
                      updateRequestBodyModel(model.id, 'modelId', value);
                      if (selectedModel) {
                        updateRequestBodyModel(model.id, 'modelName', selectedModel.name);
                      }
                    }}>
                    <SelectTrigger>
                      <SelectValue placeholder="모델 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((availableModel) => (
                        <SelectItem key={availableModel.id} value={availableModel.id}>
                          {availableModel.name}
                          {/* <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteModel(availableModel.id);
                              }}
                              className="ml-2 h-6 w-6 p-0 text-red-500 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button> */}
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
                    onClick={() => removeRequestBodyModel(model.id)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
            {requestBodyModels.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                요청 본문이 없습니다. 추가 버튼을 클릭하여 새 요청 본문을 추가하세요.
              </div>
            )}
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
        organizationId={userData?.organizationId || ''}
        setApiKeyToggle={setApiKeyToggle}
        setSelectedApiKey={setApiKeyContent}
      />
    </div>
  );
}
