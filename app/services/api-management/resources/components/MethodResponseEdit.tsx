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
import RequestHeaderListSearch from '../../models/components/RequestHeaderListSearch';
import { requestHeaderList } from '@/lib/data';

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

  const models = availableModels ?? [];
  const [openId, setOpenId] = useState<string | null>(null);

  console.log(editingResponse, editForm);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold">{editingResponse ? '응답 편집' : '새 응답 추가'}</h3>
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
          editingResponse
            ? 'border-l-4 border-l-blue-500 !mt-3'
            : 'border-l-4 border-l-green-500 !mt-3'
        }>
        <CardHeader className="pb-2">
          {/* <CardTitle className="text-base">{editingResponse && '새 응답 추가'}</CardTitle> */}
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 상태 코드 입력 */}
          <div className="mb-2">
            <Label className="text-lg font-semibold">상태 코드</Label>
            <Input
              value={editForm.statusCode}
              onChange={(e) => setEditForm({ ...editForm, statusCode: e.target.value })}
              placeholder="예: 200, 201, 400, 500"
              className="mt-1"
            />
          </div>

          {/* 응답 헤더 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Label className="text-lg font-semibold">응답 헤더</Label>
              <Button
                size="sm"
                variant={'outline'}
                className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                onClick={addHeader}>
                <span className="font-bold">추가</span>
              </Button>
            </div>
            <div className="space-y-2">
              {editForm.headers.map((header) => (
                <div key={header.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                  {/* <Select
                    value={header.value}
                    onValueChange={(value) => updateHeader(header.id, 'value', value)}>
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
                  </Select> */}
                  <div className="col-span-11">
                    <RequestHeaderListSearch
                      updateHeader={updateHeader}
                      key={header.id}
                      isOpen={openId === header.id}
                      setIsOpen={(val) => setOpenId(val ? header.id : null)}
                    />
                  </div>
                  <div
                    className={`col-span-1 gap-1 flex items-center ${openId === header.id ? 'mt-1' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-0 hover:bg-transparent bg-transparent cursor-pointer"
                      onClick={() => removeHeader(header.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {editForm.headers.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  응답 헤더가 없습니다. 추가 버튼을 클릭하여 새로운 응답 헤더를 추가하세요.
                </div>
              )}
            </div>
          </div>

          {/* 응답 본문 */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Label className="text-lg font-semibold">응답 본문</Label>
              <Button
                size="sm"
                variant={'outline'}
                className=" h-[25px] !gap-1 border-2 border-blue-500 text-blue-700 hover:text-blue-700 hover:bg-blue-50"
                onClick={addBody}>
                <span className="font-bold">추가</span>
              </Button>
            </div>
            <div className="space-y-2">
              {editForm.bodies.map((body) => (
                <div key={body.id} className="grid grid-cols-12 gap-3 items-center mb-3">
                  <div className="col-span-6">
                    <Input
                      value={body.contentType}
                      onChange={(e) => updateBody(body.id, 'contentType', e.target.value)}
                      placeholder="콘텐츠 유형"
                    />
                  </div>
                  <div className="col-span-5">
                    <Select
                      value={body.model}
                      onValueChange={(value) => {
                        const selectedModel = models.find((m) => m.id === value);
                        updateBody(body.id, 'model', value);
                        if (selectedModel) {
                          updateBody(body.id, 'model', selectedModel.name);
                        }
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="모델 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((availableModel) => (
                          <SelectItem key={availableModel.id} value={availableModel.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{availableModel.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex justify-start">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-0 hover:bg-transparent bg-transparent cursor-pointer"
                      onClick={() => removeBody(body.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {editForm.bodies.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  응답 본문이 없습니다. 추가 버튼을 클릭하여 새로운 응답 본문을 추가하세요.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
