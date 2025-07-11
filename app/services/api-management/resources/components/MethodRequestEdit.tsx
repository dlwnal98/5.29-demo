'use client';

import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2, Key, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import type { QueryParameter, RequestHeader, RequestBodyModel, Model } from '@/types/resource';
import { toast } from 'sonner';
import { ApiKey } from '@/types/methods';

interface MethodRequestEditProps {
  editForm: any;
  setEditForm: (form: any) => void;
  queryParameters: QueryParameter[];
  updateQueryParameter: (id: string, field: keyof QueryParameter, value: any) => void;
  removeQueryParameter: (id: string) => void;
  addQueryParameter: () => void;
  requestHeaders: RequestHeader[];
  updateRequestHeader: (id: string, field: keyof RequestHeader, value: any) => void;
  removeRequestHeader: (id: string) => void;
  addRequestHeader: () => void;
  requestBodyModels: RequestBodyModel[];
  updateRequestBodyModel: (id: string, field: keyof RequestBodyModel, value: any) => void;
  removeRequestBodyModel: (id: string) => void;
  addRequestBodyModel: () => void;
  availableModels: Model[];
  deleteModel: (modelId: string) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: () => void;
  requestValidators: { value: string; label: string }[];
}

export function MethodRequestEdit({
  editForm,
  setEditForm,
  queryParameters,
  updateQueryParameter,
  removeQueryParameter,
  addQueryParameter,
  requestHeaders,
  updateRequestHeader,
  removeRequestHeader,
  addRequestHeader,
  requestBodyModels,
  updateRequestBodyModel,
  removeRequestBodyModel,
  addRequestBodyModel,
  availableModels,
  deleteModel,
  handleCancelEdit,
  handleSaveEdit,
  requestValidators,
}: MethodRequestEditProps) {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isDirectUrlInput, setIsDirectUrlInput] = useState(false);
  const [selectedApiKeyId, setSelectedApiKeyId] = useState('');
  const [isCreatingNewApiKey, setIsCreatingNewApiKey] = useState(false);
  const [newApiKeyForm, setNewApiKeyForm] = useState({
    name: '',
    description: '',
  });
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
      setEditForm({
        ...editForm,
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

      setEditForm({
        ...editForm,
        apiKeyRequired: true,
        selectedApiKey: selectedApiKeyId,
      });
      toast.success('API 키가 선택되었습니다.');
    }

    setIsApiKeyModalOpen(false);
    setSelectedApiKeyId('');
  };

  const handleApiKeyModalCancel = () => {
    setEditForm({ ...editForm, apiKeyRequired: false, selectedApiKey: '' });
    setIsApiKeyModalOpen(false);
    setSelectedApiKeyId('');
    setIsCreatingNewApiKey(false);
    setNewApiKeyForm({ name: '', description: '' });
  };

  const handleApiKeyToggle = (checked: boolean) => {
    if (checked) {
      setIsApiKeyModalOpen(true);
    } else {
      setEditForm({
        ...editForm,
        apiKeyRequired: false,
        selectedApiKey: '',
      });
    }
  };
  const selectedApiKeyInfo = apiKeys.find((key) => key.id === editForm.selectedApiKey);

  console.log(editForm.apiKeyRequired);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
      <Card>
        <CardHeader>
          <CardTitle>메서드 요청 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">API 키가 필요함</Label>
            <Switch
              checked={editForm.apiKeyRequired}
              onCheckedChange={handleApiKeyToggle}
              className="mt-2"
            />
          </div>
          {editForm.selectedApiKey && selectedApiKeyInfo && (
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
          <div>
            <Label className="text-sm font-medium">요청 검사기</Label>
            <Select
              value={editForm.requestValidator}
              onValueChange={(value) => setEditForm({ ...editForm, requestValidator: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {requestValidators.map((validator) => (
                  <SelectItem key={validator.value} value={validator.value}>
                    {validator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* URL Query String Parameters Edit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            URL 쿼리 문자열 파라미터
            <Button
              size="sm"
              onClick={addQueryParameter}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queryParameters.map((param) => (
              <div key={param.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3">
                  <Input
                    value={param.name}
                    onChange={(e) => updateQueryParameter(param.id, 'name', e.target.value)}
                    placeholder="파라미터 이름"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    value={param.description}
                    onChange={(e) => updateQueryParameter(param.id, 'description', e.target.value)}
                    placeholder="설명"
                  />
                </div>

                <div className="col-span-1 flex justify-cente space-x-1">
                  <Switch
                    checked={param.required}
                    onCheckedChange={(checked) =>
                      updateQueryParameter(param.id, 'required', checked)
                    }
                  />
                  <Label className="text-sm font-medium">required</Label>
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeQueryParameter(param.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
          <CardTitle className="flex items-center justify-between">
            HTTP 요청 헤더
            <Button
              size="sm"
              onClick={addRequestHeader}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requestHeaders.map((header) => (
              <div key={header.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-6">
                  <Select
                    value={header.type}
                    onValueChange={(value) => updateRequestHeader(header.id, 'type', value)}
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
                  <Switch
                    checked={header.required}
                    onCheckedChange={(checked) =>
                      updateRequestHeader(header.id, 'required', checked)
                    }
                    // disabled={header.name === 'Content-Type'}
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeRequestHeader(header.id)}
                    disabled={header.name === 'Content-Type'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Request Body Edit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            요청 본문
            <Button
              size="sm"
              onClick={addRequestBodyModel}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requestBodyModels.map((model) => (
              <div key={model.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <Input
                    value={model.modelName}
                    onChange={(e) => updateRequestBodyModel(model.id, 'modelName', e.target.value)}
                    placeholder="콘텐츠 유형"
                  />
                </div>
                <div className="col-span-3">
                  <Select
                    value={model.modelId}
                    onValueChange={(value) => {
                      const selectedModel = availableModels.find((m) => m.id === value);
                      updateRequestBodyModel(model.id, 'modelId', value);
                      if (selectedModel) {
                        updateRequestBodyModel(model.id, 'modelName', selectedModel.name);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="모델 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((availableModel) => (
                        <SelectItem key={availableModel.id} value={availableModel.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{availableModel.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteModel(availableModel.id);
                              }}
                              className="ml-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeRequestBodyModel(model.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
                      onChange={(e) => setNewApiKeyForm({ ...newApiKeyForm, name: e.target.value })}
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
    </div>
  );
}
