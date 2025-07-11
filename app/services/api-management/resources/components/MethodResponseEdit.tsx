'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MethodResponse, ResponseHeader, ResponseBody, Model } from '@/types/resource';

interface MethodResponseEditProps {
  methodResponses: MethodResponse[];
  handleCreateResponse: () => void;
  handleEditResponse: (response: MethodResponse) => void;
  handleDeleteResponse: (response: MethodResponse) => void;
  handleCancelEdit: () => void;
  handleSaveEdit: () => void;
  editingResponse?: MethodResponse | null;
  availableModels?: Model[];
  deleteModel?: (modelId: string) => void;
}

export function MethodResponseEdit({
  methodResponses,
  handleCreateResponse,
  handleEditResponse,
  handleDeleteResponse,
  handleCancelEdit,
  handleSaveEdit,
  editingResponse,
  availableModels,
  deleteModel,
}: MethodResponseEditProps) {
  const [editForm, setEditForm] = useState({
    statusCode: '',
    headers: [] as ResponseHeader[],
    bodies: [] as ResponseBody[],
  });

  // editingResponse가 변경될 때마다 폼 초기화
  useEffect(() => {
    if (editingResponse) {
      setEditForm({
        statusCode: editingResponse.statusCode,
        headers: [...editingResponse.headers],
        bodies: [...editingResponse.bodies],
      });
    } else {
      setEditForm({
        statusCode: '',
        headers: [],
        bodies: [],
      });
    }
  }, [editingResponse]);

  const handleSaveResponse = () => {
    handleSaveEdit();
  };

  const handleCancelResponse = () => {
    handleCancelEdit();
  };

  const addHeader = () => {
    const newHeader: ResponseHeader = {
      id: Date.now().toString(),
      name: '',
      value: '',
    };
    setEditForm({
      ...editForm,
      headers: [...editForm.headers, newHeader],
    });
  };

  const updateHeader = (id: string, field: keyof ResponseHeader, value: string) => {
    setEditForm({
      ...editForm,
      headers: editForm.headers.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      ),
    });
  };

  const removeHeader = (id: string) => {
    setEditForm({
      ...editForm,
      headers: editForm.headers.filter((header) => header.id !== id),
    });
  };

  const addBody = () => {
    const newBody: ResponseBody = {
      id: Date.now().toString(),
      contentType: 'application/json',
      model: 'Empty',
    };
    setEditForm({
      ...editForm,
      bodies: [...editForm.bodies, newBody],
    });
  };

  const updateBody = (id: string, field: keyof ResponseBody, value: string) => {
    setEditForm({
      ...editForm,
      bodies: editForm.bodies.map((body) => (body.id === id ? { ...body, [field]: value } : body)),
    });
  };

  const removeBody = (id: string) => {
    setEditForm({
      ...editForm,
      bodies: editForm.bodies.filter((body) => body.id !== id),
    });
  };
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
  const models = availableModels ?? [];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{editingResponse ? '응답 편집' : '새 응답 추가'}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCancelResponse}>
            <X className="h-4 w-4 mr-1" />
            취소
          </Button>
          <Button size="sm" onClick={handleSaveResponse}>
            <Save className="h-4 w-4 mr-1" />
            {editingResponse ? '저장' : '추가'}
          </Button>
        </div>
      </div>

      <Card
        className={
          editingResponse ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-green-500'
        }
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{editingResponse && '새 응답 추가'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 상태 코드 입력 */}
          <div>
            <Label className="text-sm font-medium">상태 코드</Label>
            <Input
              value={editForm.statusCode}
              onChange={(e) => setEditForm({ ...editForm, statusCode: e.target.value })}
              placeholder="예: 200, 201, 400, 500"
              className="mt-1"
            />
          </div>

          {/* 응답 헤더 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">응답 헤더</Label>
              <Button variant="outline" size="sm" onClick={addHeader}>
                <Plus className="h-4 w-4 mr-1" />
                헤더 추가
              </Button>
            </div>
            <div className="space-y-2">
              {editForm.headers.map((header) => (
                <div key={header.id} className="flex items-center gap-2">
                  <Select
                    value={header.value}
                    onValueChange={(value) => updateHeader(header.id, 'value', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="헤더 유형" />
                    </SelectTrigger>
                    <SelectContent>
                      {httpHeaderOptions.map((headerName) => (
                        <SelectItem key={headerName} value={headerName}>
                          {headerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => removeHeader(header.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 응답 본문 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">응답 본문</Label>
              <Button variant="outline" size="sm" onClick={addBody}>
                <Plus className="h-4 w-4 mr-1" />
                본문 추가
              </Button>
            </div>
            <div className="space-y-2">
              {editForm.bodies.map((body) => (
                <div key={body.id} className="flex items-center gap-2">
                  <div className="col-span-4">
                    <Input
                      value={body.contentType}
                      onChange={(e) => updateBody(body.id, 'contentType', e.target.value)}
                      placeholder="콘텐츠 유형"
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      value={body.model}
                      onValueChange={(value) => {
                        const selectedModel = models.find((m) => m.id === value);
                        updateBody(body.id, 'model', value);
                        if (selectedModel) {
                          updateBody(body.id, 'model', selectedModel.name);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="모델 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((availableModel) => (
                          <SelectItem key={availableModel.id} value={availableModel.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{availableModel.name}</span>
                              {deleteModel && (
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
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => removeBody(body.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
