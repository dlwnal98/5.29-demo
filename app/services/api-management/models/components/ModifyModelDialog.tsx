'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { Copy, Edit } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useModifyModel, ModelData, ModifyModelProps } from '@/hooks/use-model';
import { useClipboard } from 'use-clipboard-copy';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

interface ModifyModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: ModelData;
  userKey: string;
}

export default function ModifyModelDialog({
  open,
  onOpenChange,
  userKey,
  selectedModel,
}: ModifyModelDialogProps) {
  console.log(selectedModel);
  const { mutate: modifyModelSchema } = useModifyModel({
    onSuccess: () => {
      toast.success('모델이 성공적으로 생성되었습니다.');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('유효한 JSON 형식이 아닙니다!');
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [json, setJson] = useState('');

  const [modelForm, setModelForm] = useState<ModifyModelProps>({
    modelName: '',
    description: '',
    version: '1.1.0',
    jsonSchema: {
      type: 'object',
      properties: {},
    },
    properties: {},
    examples: [],
    updatedBy: '',
  });

  useEffect(() => {
    setIsEditMode(false);
  }, [open]);

  useEffect(() => {
    const propertiesJson = selectedModel?.jsonSchema?.properties
      ? JSON.stringify(selectedModel?.jsonSchema?.properties, null, 2)
      : '{}';
    setJson(propertiesJson);

    setModelForm((prev) => ({
      ...prev,
      modelName: selectedModel.modelName || '',
      description: selectedModel.description || '',
      version: selectedModel.version || '1.1.0',
      jsonSchema: selectedModel.jsonSchema || { type: 'object', properties: {} },
      properties: selectedModel.properties || {},
      examples: [
        {
          id: 'USR123456789',
          name: '홍길동',
          email: 'hong@example.com',
        },
        {
          id: 'USR987654321',
          name: '김철수',
          email: 'kim@example.com',
        },
      ], // 예제 데이터가 있으면 활용
      //  examples: selectedModel.examples,
      updatedBy: userKey || '',
    }));
  }, [selectedModel]);

  console.log(modelForm);

  const handleModifyModel = () => {
    try {
      const parsed = JSON.parse(json);

      const updatedForm = {
        ...modelForm,
        properties: parsed,
        jsonSchema: {
          ...modelForm.jsonSchema,
          properties: parsed,
        },
      };

      setModelForm(updatedForm); // 상태는 업데이트
      modifyModelSchema({ modelId: selectedModel.modelId, data: updatedForm }); // 동일한 최신 값으로 API 호출
    } catch (error) {
      toast.error('유효하지 않은 JSON 형식입니다.');
      console.error('Invalid JSON:', error);
    }
  };

  const clipboard = useClipboard();

  const copySchema = (schema: string) => {
    clipboard.copy(schema);
    toast.success('스키마가 클립보드에 복사되었습니다.');
  };

  const getSchemaByteCount = (schema: string) => {
    return new TextEncoder().encode(schema).length;
  };
  const handleChange = (value: string) => {
    setJson(value); // 에디터 상태 업데이트
  };

  if (isEditMode)
    return (
      <>
        <Toaster position="bottom-center" richColors expand={true} />
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <span>모델 편집</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditMode(!isEditMode);
                  }}
                  className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4 text-gray-900" />
                </Button>
              </DialogTitle>

              <DialogDescription className="text-gray-600">
                기존 모델을 편집합니다. (<span className="text-red-500">*</span> 필수 입력
                사항입니다.)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Model Name */}
              <div>
                <Label
                  htmlFor="model-name"
                  className="text-sm font-medium text-gray-700 mb-2 block">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model-name"
                  placeholder="모델 이름을 입력하세요"
                  value={modelForm.modelName ? modelForm.modelName : selectedModel?.modelName}
                  onChange={(e) =>
                    setModelForm((prev) => ({
                      ...prev,
                      modelName: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>

              {/* Content Type */}
              <div>
                <Label
                  htmlFor="content-type"
                  className="text-sm font-medium text-gray-700 mb-2 block">
                  콘텐츠 유형
                </Label>
                <Input
                  id="content-type"
                  // value={selectedModel?.['content-type']}
                  // onChange={(e) => setModelForm({ ...modelForm, contentType: e.target.value })}
                  className="w-full bg-gray-50"
                  placeholder="application/json"
                  disabled
                />
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700 mb-2 block">
                  설명
                </Label>
                <Textarea
                  id="description"
                  placeholder="모델에 대한 설명을 입력하세요"
                  value={modelForm.description ? modelForm.description : selectedModel?.description}
                  onChange={(e) =>
                    setModelForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full min-h-[80px] resize-none"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {modelForm?.description?.length}/500 자
                </div>
              </div>

              {/* Model Schema */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">모델 스키마</Label>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 border-b flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">JSON Schema</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copySchema(JSON.stringify(modelForm?.jsonSchema?.properties, null, 2))
                        }
                        className="h-7 px-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 min-h-[400px]">
                    {/* Schema Editor */}
                    <div className="col-span-12 p-0">
                      <AceEditor
                        placeholder="모델 스키마를 입력해주세요"
                        mode="json"
                        theme="monokai"
                        name="blah2"
                        onChange={handleChange}
                        width="100%"
                        height="400px"
                        fontSize={14}
                        lineHeight={25}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={json}
                        setOptions={{
                          enableBasicAutocompletion: false,
                          enableLiveAutocompletion: false,
                          enableSnippets: false,
                          enableMobileMenu: true,
                          showLineNumbers: true,
                          tabSize: 2,
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-3 py-2 border-t flex items-center justify-end text-xs text-gray-500">
                    <div>
                      {getSchemaByteCount(
                        JSON.stringify(selectedModel?.jsonSchema?.properties, null, 2)
                      )}{' '}
                      bytes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                }}>
                취소
              </Button>
              <Button
                onClick={handleModifyModel}
                className="bg-blue-500 hover:bg-blue-600 text-white">
                수정
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  else
    return (
      <>
        <Toaster position="bottom-center" richColors expand={true} />
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <span>모델 상세보기</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditMode(!isEditMode);
                  }}
                  className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4 text-gray-900" />
                </Button>
              </DialogTitle>

              <DialogDescription className="text-gray-600">
                생성된 모델을 보여줍니다.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {/* Model Name */}
              <div>
                <Label
                  htmlFor="model-name"
                  className="text-sm font-medium text-gray-500 mb-1 block">
                  이름
                </Label>
                <Input
                  id="model-name"
                  placeholder="모델 이름을 입력하세요"
                  disabled
                  value={modelForm.modelName ? modelForm.modelName : selectedModel?.modelName}
                  onChange={(e) =>
                    setModelForm((prev) => ({
                      ...prev,
                      modelName: e.target.value,
                    }))
                  }
                  className="w-full border-0 text-gray-900 p-0 disabled:opacity-1"
                />
              </div>

              {/* Content Type */}
              <div>
                <Label
                  htmlFor="content-type"
                  className="text-sm font-medium text-gray-500 mb-1 block">
                  콘텐츠 유형
                </Label>
                <Input
                  id="content-type"
                  value={'application/json'}
                  // onChange={(e) => setModelForm({ ...modelForm, contentType: e.target.value })}
                  className="w-full border-0 text-gray-900 p-0 disabled:opacity-1"
                  disabled
                  placeholder="application/json"
                />
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-500 mb-1 block">
                  설명
                </Label>
                <Textarea
                  id="description"
                  placeholder="모델에 대한 설명을 입력하세요"
                  value={modelForm.description ? modelForm.description : selectedModel?.description}
                  onChange={(e) =>
                    setModelForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full h-auto resize-none border-0 text-gray-900 p-0 disabled:opacity-1"
                  disabled
                  maxLength={500}
                />
              </div>

              {/* Model Schema */}
              <div>
                <Label className="text-sm font-medium text-gray-500 mb-2 block">모델 스키마</Label>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 border-b flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">JSON Schema</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copySchema(JSON.stringify(modelForm?.jsonSchema?.properties, null, 2))
                        }
                        className="h-7 px-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 min-h-[400px]">
                    {/* Schema Editor */}
                    <div className="col-span-12 p-0">
                      <AceEditor
                        placeholder="모델 스키마를 입력해주세요"
                        mode="json"
                        theme="monokai"
                        name="blah2"
                        onChange={handleChange}
                        width="100%"
                        height="400px"
                        fontSize={14}
                        lineHeight={25}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={json}
                        readOnly={true}
                        setOptions={{
                          enableBasicAutocompletion: false,
                          enableLiveAutocompletion: false,
                          enableSnippets: false,
                          enableMobileMenu: true,
                          showLineNumbers: true,
                          tabSize: 2,
                          // readOnly: true,
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-3 py-2 border-t flex items-center justify-end text-xs text-gray-500">
                    <div>
                      {getSchemaByteCount(
                        JSON.stringify(selectedModel?.jsonSchema?.properties, null, 2)
                      )}{' '}
                      bytes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                onClick={() => {
                  onOpenChange(false);
                }}>
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
}
