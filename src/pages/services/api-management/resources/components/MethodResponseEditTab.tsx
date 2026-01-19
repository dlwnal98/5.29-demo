import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MethodFormData } from '../hooks/useMethodEditForm';

interface ModelItem {
  modelId: string;
  modelName: string;
  description?: string;
}

interface MethodResponseEditTabProps {
  formData: MethodFormData;
  modelList: ModelItem[];
  onChange: (updates: Partial<MethodFormData>) => void;
}

const commonStatusCodes = [
  { code: '200', description: '성공' },
  { code: '201', description: '생성됨' },
  { code: '204', description: '콘텐츠 없음' },
  { code: '400', description: '잘못된 요청' },
  { code: '401', description: '인증 필요' },
  { code: '403', description: '접근 금지' },
  { code: '404', description: '찾을 수 없음' },
  { code: '500', description: '서버 오류' },
];

export function MethodResponseEditTab({
  formData,
  modelList,
  onChange,
}: MethodResponseEditTabProps) {
  const [expandedResponse, setExpandedResponse] = useState<number | null>(null);

  const addResponse = () => {
    const newResponse = {
      statusCode: '',
      description: '',
      modelId: '',
      headers: [],
    };
    onChange({
      responses: [...formData.responses, newResponse],
    });
    setExpandedResponse(formData.responses.length);
  };

  const updateResponse = (
    index: number,
    field: 'statusCode' | 'description' | 'modelId',
    value: string
  ) => {
    const updated = formData.responses.map((response, idx) =>
      idx === index ? { ...response, [field]: value } : response
    );
    onChange({ responses: updated });
  };

  const removeResponse = (index: number) => {
    const updated = formData.responses.filter((_, idx) => idx !== index);
    onChange({ responses: updated });
    if (expandedResponse === index) {
      setExpandedResponse(null);
    }
  };

  // 응답 헤더 관련 함수들
  const addResponseHeader = (responseIndex: number) => {
    const updated = formData.responses.map((response, idx) => {
      if (idx === responseIndex) {
        return {
          ...response,
          headers: [
            ...response.headers,
            { name: '', description: '', required: false },
          ],
        };
      }
      return response;
    });
    onChange({ responses: updated });
  };

  const updateResponseHeader = (
    responseIndex: number,
    headerIndex: number,
    field: 'name' | 'description' | 'required',
    value: string | boolean
  ) => {
    const updated = formData.responses.map((response, idx) => {
      if (idx === responseIndex) {
        const updatedHeaders = response.headers.map((header, hIdx) => {
          if (hIdx === headerIndex) {
            return { ...header, [field]: value };
          }
          return header;
        });
        return { ...response, headers: updatedHeaders };
      }
      return response;
    });
    onChange({ responses: updated });
  };

  const removeResponseHeader = (responseIndex: number, headerIndex: number) => {
    const updated = formData.responses.map((response, idx) => {
      if (idx === responseIndex) {
        return {
          ...response,
          headers: response.headers.filter((_, hIdx) => hIdx !== headerIndex),
        };
      }
      return response;
    });
    onChange({ responses: updated });
  };

  const getStatusCodeColor = (code: string) => {
    if (code.startsWith('2')) return 'bg-green-100 text-green-800 border-green-200';
    if (code.startsWith('3')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (code.startsWith('4')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (code.startsWith('5')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 !text-lg">
            Method Response
            <Button
              size="sm"
              variant={'outline'}
              className="h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
              onClick={addResponse}>
              <Plus className="h-4 w-4" />
              <span className="font-bold">Add Response</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.responses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="mb-4">No response defined.</p>
              <p className="text-sm">Click the Add Response button to add a new response.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.responses.map((response, index) => (
                <div
                  key={`response-${index}`}
                  className="border rounded-lg overflow-hidden">
                  {/* Response Header */}
                  <div
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${expandedResponse === index ? 'bg-gray-50 dark:bg-gray-800' : ''
                      }`}
                    onClick={() =>
                      setExpandedResponse(expandedResponse === index ? null : index)
                    }>
                    <div className="flex items-center gap-3">
                      {expandedResponse === index ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                      <span
                        className={`px-2 py-1 rounded text-sm font-mono font-medium border ${getStatusCodeColor(
                          response.statusCode
                        )}`}>
                        {response.statusCode || '???'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {response.description || 'Description None'}
                      </span>
                      {response.headers.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          Header {response.headers.length}
                        </span>
                      )}
                      {response.modelId && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          Model Set
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeResponse(index);
                      }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Response Details (Expanded) */}
                  {expandedResponse === index && (
                    <div className="p-4 border-t bg-white dark:bg-gray-900 space-y-6">
                      {/* 상태 코드 & 설명 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Status Code <span className="text-red-500">*</span></Label>
                          <Select
                            value={response.statusCode}
                            onValueChange={(value) =>
                              updateResponse(index, 'statusCode', value)
                            }>
                            <SelectTrigger>
                              <SelectValue placeholder="Status Code Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {commonStatusCodes.map((status) => (
                                <SelectItem key={status.code} value={status.code}>
                                  <span className="font-mono">{status.code}</span>
                                  <span className="ml-2 text-gray-500">
                                    - {status.description}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">
                            Or directly input:
                            <Input
                              value={response.statusCode}
                              onChange={(e) =>
                                updateResponse(index, 'statusCode', e.target.value)
                              }
                              placeholder="예: 200, 201, 400"
                              className="mt-1"
                            />
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={response.description}
                            onChange={(e) =>
                              updateResponse(index, 'description', e.target.value)
                            }
                            placeholder="Enter a description for this response"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* 응답 본문 (모델) */}
                      <div className="space-y-2">
                        <Label>Response Body (Model)</Label>
                        <Select
                          value={response.modelId || '__none__'}
                          onValueChange={(value) =>
                            updateResponse(index, 'modelId', value === '__none__' ? '' : value)
                          }>
                          <SelectTrigger>
                            <SelectValue placeholder="Model Select (Optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">None</SelectItem>
                            {modelList?.map((model) => (
                              <SelectItem key={model.modelId} value={model.modelId}>
                                {model.modelName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Select the model to define the schema of the response body.
                        </p>
                      </div>

                      {/* 응답 헤더 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Response Header</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-[25px] !gap-1 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => addResponseHeader(index)}>
                            <Plus className="h-3 w-3" />
                            <span className="text-xs font-bold">Header Add</span>
                          </Button>
                        </div>

                        {response.headers.length === 0 ? (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm">No defined response headers.</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-2">
                              <div className="col-span-4">Header Name</div>
                              <div className="col-span-5">Description</div>
                              <div className="col-span-2 text-center">Required</div>
                              <div className="col-span-1"></div>
                            </div>
                            {response.headers.map((header, headerIndex) => (
                              <div
                                key={`header-${headerIndex}`}
                                className="grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                <div className="col-span-4">
                                  <Input
                                    value={header.name}
                                    onChange={(e) =>
                                      updateResponseHeader(
                                        index,
                                        headerIndex,
                                        'name',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Header Name"
                                    className="h-8"
                                  />
                                </div>
                                <div className="col-span-5">
                                  <Input
                                    value={header.description}
                                    onChange={(e) =>
                                      updateResponseHeader(
                                        index,
                                        headerIndex,
                                        'description',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Description"
                                    className="h-8"
                                  />
                                </div>
                                <div className="col-span-2 flex justify-center">
                                  <Switch
                                    checked={header.required}
                                    onCheckedChange={(checked) =>
                                      updateResponseHeader(
                                        index,
                                        headerIndex,
                                        'required',
                                        checked
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      removeResponseHeader(index, headerIndex)
                                    }>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 일반적인 응답 패턴 추가 도우미 */}
      <Card>
        <CardHeader>
          <CardTitle className="!text-lg">Quick Response Add</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonStatusCodes.map((status) => {
              const isAdded = formData.responses.some((r) => r.statusCode === status.code);
              return (
                <Button
                  key={status.code}
                  variant="outline"
                  size="sm"
                  disabled={isAdded}
                  className={`${getStatusCodeColor(status.code)} ${isAdded ? 'opacity-50' : ''
                    }`}
                  onClick={() => {
                    if (!isAdded) {
                      onChange({
                        responses: [
                          ...formData.responses,
                          {
                            statusCode: status.code,
                            description: status.description,
                            modelId: '',
                            headers: [],
                          },
                        ],
                      });
                    }
                  }}>
                  {status.code} {status.description}
                  {isAdded && ' (Added)'}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
