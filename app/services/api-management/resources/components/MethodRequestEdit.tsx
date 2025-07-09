import React from 'react';
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
import { Plus, Trash2 } from 'lucide-react';
import type { QueryParameter, RequestHeader, RequestBodyModel, Model } from '@/types/resource';

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
              onCheckedChange={(checked) => setEditForm({ ...editForm, apiKeyRequired: checked })}
              className="mt-2"
            />
          </div>
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
                <div className="col-span-2">
                  <Select
                    value={param.type}
                    onValueChange={(value) => updateQueryParameter(param.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="number">number</SelectItem>
                      <SelectItem value="boolean">boolean</SelectItem>
                      <SelectItem value="array">array</SelectItem>
                    </SelectContent>
                  </Select>
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
                <div className="col-span-4">
                  <Input
                    value={header.name}
                    onChange={(e) => updateRequestHeader(header.id, 'name', e.target.value)}
                    placeholder="헤더 이름"
                    disabled={header.name === 'Content-Type'}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    value={header.description}
                    onChange={(e) => updateRequestHeader(header.id, 'description', e.target.value)}
                    placeholder="설명"
                  />
                </div>
                <div className="col-span-2">
                  <Select
                    value={header.type}
                    onValueChange={(value) => updateRequestHeader(header.id, 'type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="number">number</SelectItem>
                      <SelectItem value="boolean">boolean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 flex justify-center">
                  <Switch
                    checked={header.required}
                    onCheckedChange={(checked) =>
                      updateRequestHeader(header.id, 'required', checked)
                    }
                    disabled={header.name === 'Content-Type'}
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
                  <Select
                    value={model.contentType}
                    onValueChange={(value) =>
                      updateRequestBodyModel(model.id, 'contentType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="application/json">application/json</SelectItem>
                      <SelectItem value="application/xml">application/xml</SelectItem>
                      <SelectItem value="text/plain">text/plain</SelectItem>
                      <SelectItem value="application/x-www-form-urlencoded">
                        application/x-www-form-urlencoded
                      </SelectItem>
                      <SelectItem value="multipart/form-data">multipart/form-data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4">
                  <Input
                    value={model.modelName}
                    onChange={(e) => updateRequestBodyModel(model.id, 'modelName', e.target.value)}
                    placeholder="모델 이름"
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
    </div>
  );
}
