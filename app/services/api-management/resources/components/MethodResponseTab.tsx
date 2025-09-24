import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MethodResponseEdit } from './MethodResponseEdit';
import type { MethodResponse, Model } from '@/types/resource';
import { useMethodEditStore } from '@/store/store';

interface MethodResponseTabProps {
  methodResponses: MethodResponse[];
  handleCreateResponse: () => void;
  handleEditResponse: (response: MethodResponse) => void;
  handleDeleteResponse: (response: MethodResponse) => void;
  availableModels?: Model[];
  deleteModel?: (modelId: string) => void;
}

export function MethodResponseTab({
  methodResponses,
  handleCreateResponse,
  handleEditResponse,
  handleDeleteResponse,
  availableModels,
  deleteModel,
}: MethodResponseTabProps) {
  const isEditMode = useMethodEditStore((state) => state.isEdit);
  const setIsEditMode = useMethodEditStore((state) => state.setIsEdit);

  const [editingResponse, setEditingResponse] = useState<MethodResponse | null>(null);

  const handleStartEdit = (response: MethodResponse) => {
    setEditingResponse(response);
    setIsEditMode(true);
  };

  const handleStartCreate = () => {
    setEditingResponse(null);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingResponse(null);
  };

  const handleSaveEdit = () => {
    setIsEditMode(false);
    setEditingResponse(null);
    // 실제 저장 로직은 부모 컴포넌트에서 처리
  };

  if (isEditMode) {
    return (
      <MethodResponseEdit
        methodResponses={editingResponse ? [editingResponse] : []}
        handleCreateResponse={handleCreateResponse}
        handleEditResponse={handleEditResponse}
        handleDeleteResponse={handleDeleteResponse}
        handleCancelEdit={handleCancelEdit}
        handleSaveEdit={handleSaveEdit}
        editingResponse={editingResponse}
        availableModels={availableModels}
        deleteModel={deleteModel}
      />
    );
  }

  console.log(methodResponses);

  //응답 200은 기본적으로 들어가 있는 거라서

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">메서드 응답</h3>
        <Button onClick={handleStartCreate} className="bg-blue-500 hover:bg-blue-600 text-white">
          응답 추가
        </Button>
      </div>
      {methodResponses.length > 0 ? (
        <div className="space-y-4">
          {methodResponses.map((response) => (
            <Card key={response.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>HTTP {response.statusCode}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleStartEdit(response)}>
                    편집
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteResponse(response)}>
                    삭제
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">헤더</Label>
                  {response.headers.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {response.headers.map((header) => (
                        <li key={header.id}>
                          {header.name}: {header.value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">헤더가 없습니다.</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">본문</Label>
                  {response.bodies.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {response.bodies.map((body) => (
                        <li key={body.id}>
                          {body.contentType}: {body.model}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">본문이 없습니다.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 mb-2">정의된 응답이 없습니다</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            응답 추가 버튼을 클릭하여 새 응답을 추가하세요.
          </p>
        </div>
      )}
    </>
  );
}
