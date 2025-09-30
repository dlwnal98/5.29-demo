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
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreateModelProps, useCreateModel } from '@/hooks/use-model';
import { useClipboard } from 'use-clipboard-copy';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';

interface CreateModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiId: string;
  userKey: string;
}

export default function CreateModelDialog({
  open,
  onOpenChange,
  apiId,
  userKey,
}: CreateModelDialogProps) {
  const { mutate: createModelSchema } = useCreateModel({
    onSuccess: () => {
      toast.success('모델이 성공적으로 생성되었습니다.');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('유효한 JSON 형식이 아닙니다!');
    },
  });

  const [json, setJson] = useState('');

  const [createModelForm, setCreateModelForm] = useState<CreateModelProps>({
    apiId: '',
    modelName: '',
    description: '',
    jsonSchema: {
      type: '',
      properties: {},
    },
    examples: [{}],
    createdBy: '',
  });

  useEffect(() => {
    setJson('');
    if (apiId && userKey)
      setCreateModelForm({
        apiId: apiId,
        modelName: '',
        description: '',
        jsonSchema: {
          type: '',
          properties: {},
        },
        examples: [{}],
        createdBy: userKey,
      });
  }, [open]);

  const handleCreateModel = () => {
    try {
      const parsed = JSON.parse(json);

      const updatedForm = {
        ...createModelForm,
        jsonSchema: {
          ...createModelForm.jsonSchema,
          properties: parsed,
        },
      };

      setCreateModelForm(updatedForm); // 상태는 업데이트
      createModelSchema(updatedForm); // 동일한 최신 값으로 API 호출
    } catch (error) {
      toast.error('유효하지 않은 JSON 형식입니다.');
      console.error('Invalid JSON:', error);
    }
  };

  const getSchemaByteCount = (schema: string) => {
    return new TextEncoder().encode(schema).length;
  };
  const handleChange = (value: string) => {
    setJson(value); // 에디터 상태 업데이트
  };

  return (
    <>
      <Toaster position="bottom-center" richColors expand={true} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-600">모델 생성</DialogTitle>
            <DialogDescription className="text-gray-600">
              새로운 모델을 생성합니다. (<span className="text-red-500">*</span> 필수 입력
              사항입니다.)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Model Name */}
            <div>
              <Label htmlFor="model-name" className="text-sm font-medium text-gray-700 mb-2 block">
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="model-name"
                placeholder="모델 이름을 입력하세요"
                value={createModelForm.modelName}
                onChange={(e) =>
                  setCreateModelForm((prev) => ({
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
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                설명
              </Label>
              <Textarea
                id="description"
                placeholder="모델에 대한 설명을 입력하세요"
                value={createModelForm.description}
                onChange={(e) =>
                  setCreateModelForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full min-h-[80px] resize-none"
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {createModelForm?.description?.length}/500 자
              </div>
            </div>

            {/* Model Schema */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">모델 스키마</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">JSON Schema</span>
                  {/* <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copySchema(JSON.stringify(createModelForm?.jsonSchema?.properties, null, 2))
                      }
                      className="h-7 px-2">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div> */}
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
                  <div>{getSchemaByteCount(json)} bytes</div>
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
              onClick={handleCreateModel}
              className="bg-blue-500 hover:bg-blue-600 text-white">
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
