import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { sampleApiData } from '@/constants/sample-api-data';
import { useCloneCreateAPI, useCreateAPI } from '@/hooks/use-apimanagement';
import { APIListData } from '@/hooks/use-apimanagement';

interface ApiCreateModalProps {
  userKey: string;
  organizationId: string;
  open: boolean;
  apiList: APIListData[];
  onOpenChange: (open: boolean) => void;
}

const ApiCreateModal = ({
  userKey,
  organizationId,
  open,
  apiList,
  onOpenChange,
}: ApiCreateModalProps) => {
  const [createApiForm, setCreateApiForm] = useState({
    organizationId: organizationId,
    name: '',
    description: '',
    createdBy: userKey,
  });
  const [apiType, setApiType] = useState('new');
  const [swaggerFile, setSwaggerFile] = useState<File | null>(null);
  const [swaggerContent, setSwaggerContent] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [copyApiId, setCopyApiId] = useState('');

  useEffect(() => {
    if (organizationId && userKey) {
      setCreateApiForm((prev) => ({ ...prev, organizationId: organizationId, createdBy: userKey }));
    }
  }, [organizationId, userKey]);

  // 파일 드래그/업로드 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (
        file.type === 'application/json' ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.yaml') ||
        file.name.endsWith('.yml')
      ) {
        setSwaggerFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCreateApiForm((prev) => ({ ...prev, swaggerContent: content }));
        };
        reader.readAsText(file);
      } else {
        toast.error('JSON, YAML 파일만 업로드 가능합니다.');
      }
    }
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSwaggerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCreateApiForm((prev) => ({ ...prev, swaggerContent: content }));
      };
      reader.readAsText(file);
    }
  };

  // API 직접입력 생성
  const { mutate: createAPI } = useCreateAPI({
    onSuccess: () => {
      onOpenChange(false);
      setApiType('new');
      setSwaggerContent('');
      setSwaggerFile(null);
      setCreateApiForm((prev) => ({ ...prev, name: '', description: '' }));
      setCopyApiId('');
      toast.success(`API '${createApiForm.name}'이(가) 생성되었습니다.`);
    },
  });

  //API 복제 생성
  const { mutate: cloneCreateAPI } = useCloneCreateAPI({
    onSuccess: () => {
      onOpenChange(false);
      setApiType('new');
      setSwaggerContent('');
      setSwaggerFile(null);
      setCreateApiForm((prev) => ({ ...prev, name: '', description: '' }));
      setCopyApiId('');
      toast.success(`API '${createApiForm.name}'이(가) 생성되었습니다.`);
    },
  });

  // 생성 버튼 클릭
  const handleCreateApi = () => {
    if (!createApiForm.name.trim()) {
      toast.error('API 이름을 입력해주세요.');
      return;
    }

    if (apiType === 'new') {
      if (organizationId && userKey) createAPI(createApiForm);
    }

    if (apiType === 'copy') {
      if (!copyApiId) {
        toast.error('복사할 API를 선택해주세요.');
        return;
      } else {
        cloneCreateAPI({
          copyApiId: copyApiId,
          targetOrganizationId: organizationId,
          newName: createApiForm.name,
          userKey: userKey,
          description: createApiForm.description,
        });
      }
    }

    if (apiType === 'swagger' && !swaggerContent.trim()) {
      toast.error('Swagger 내용을 입력하거나 파일을 업로드해주세요.');
      return;
    }
  };

  // 취소 버튼 클릭
  const handleCancel = () => {
    onOpenChange(false);
    setApiType('new');
    setSwaggerContent('');
    setSwaggerFile(null);
    setCreateApiForm((prev) => ({ ...prev, name: '', description: '' }));
    setCopyApiId('');
  };

  // 타입별 입력 UI
  const renderCreateApiContent = () => {
    switch (apiType) {
      case 'copy':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                복사할 API 선택 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={copyApiId ? copyApiId : ''}
                onValueChange={(value) => setCopyApiId(value)}>
                <SelectTrigger className="!h-[50px]">
                  <SelectValue placeholder="복사할 API를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {apiList?.map((api) => (
                    <SelectItem key={api.apiId} value={api.apiId}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{api.name}</span>
                        <span className="text-xs text-gray-500">{api.apiId}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'swagger':
        return (
          <div className="space-y-4">
            <Tabs defaultValue="swagger" className="w-full">
              <TabsContent value="swagger" className="space-y-4">
                <input
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="swagger-upload"
                />
                {!swaggerFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg text-center transition-colors ${
                      isDragOver ? 'border-blue-500 bg-blue-100' : 'border-blue-300 bg-blue-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}>
                    <label
                      htmlFor="swagger-upload"
                      className="flex flex-col items-center space-y-3 w-full h-full cursor-pointer mb-2 text-blue-600 p-8 ">
                      <Upload className="h-8 w-8 text-blue-600 mx-auto" />
                      <p className="text-gray-600">
                        파일을 여기로 드래그하거나 클릭하여 업로드하세요
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <label
                      htmlFor="swagger-upload"
                      className="flex items-center text-[12px] font-medium cursor-pointer text-blue-600 hover:text-blue-700 px-4 py-2 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors">
                      <Upload className="h-4 w-4 text-blue-600 mx-auto mr-2" /> 파일 선택
                    </label>
                    <p className="ml-3 text-sm text-green-600 font-medium">
                      선택된 파일: {swaggerFile?.name}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <Textarea
                      placeholder="Swagger JSON 또는 YAML 내용을 입력하세요..."
                      value={swaggerContent}
                      onChange={(e) => {
                        setCreateApiForm((prev) => ({ ...prev, swaggerContent: e.target.value }));
                      }}
                      className="min-h-[300px] font-mono text-sm resize-none"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="space-y-4">
                {swaggerContent ? (
                  <div className="border rounded-lg bg-gray-50">
                    <div className="p-3 border-b bg-white">
                      <Label className="text-sm font-medium text-gray-700">Swagger 미리보기</Label>
                    </div>
                    <div className="p-4">
                      <pre className="text-xs bg-white p-4 rounded border max-h-96 overflow-auto font-mono">
                        {swaggerContent}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>미리보기할 내용이 없습니다.</p>
                    <p className="text-sm">Swagger 탭에서 내용을 입력해주세요.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'example':
        return (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <Textarea
                value={sampleApiData}
                disabled
                className="min-h-[300px] font-mono text-sm resize-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">API Plan 생성</DialogTitle>
          <DialogDescription className="text-gray-600">
            API는 4가지 방법으로 생성할 수 있습니다. (<span className="text-red-500">*</span> 필수
            입력 사항입니다.)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* API 생성 유형 */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              API 생성 유형 <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={apiType}
              onValueChange={(value) => {
                setApiType(value);
                setSwaggerContent('');
                setSwaggerFile(null);
                setCreateApiForm((prev) => ({ ...prev, name: '', description: '' }));
                setCopyApiId('');
              }}
              className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label
                  htmlFor="new"
                  className={`text-sm ${apiType === 'new' ? 'text-blue-600 font-medium' : ''} hover:cursor-pointer`}>
                  새로운 API
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="copy" id="copy" />
                <Label
                  htmlFor="copy"
                  className={`text-sm ${apiType === 'copy' ? 'text-blue-600 font-medium' : ''} hover:cursor-pointer`}>
                  API 복사
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="swagger" id="swagger" />
                <Label
                  htmlFor="swagger"
                  className={`text-sm ${apiType === 'swagger' ? 'text-blue-600 font-medium' : ''} hover:cursor-pointer`}>
                  Swagger에서 가져오기
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="example" id="example" />
                <Label
                  htmlFor="example"
                  className={`text-sm ${apiType === 'example' ? 'text-blue-600 font-medium' : ''} hover:cursor-pointer`}>
                  API 예제
                </Label>
              </div>
            </RadioGroup>
          </div>
          {/* API 이름 */}
          <div>
            <Label htmlFor="api-name" className="text-sm font-medium text-gray-700 mb-2 block">
              API 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="api-name"
              placeholder="API 이름을 입력하세요"
              value={createApiForm.name}
              onChange={(e) => setCreateApiForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </div>
          {/* 설명 */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
              설명
            </Label>
            <Textarea
              id="description"
              placeholder="설명을 입력하세요"
              value={createApiForm.description}
              onChange={(e) =>
                setCreateApiForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full min-h-[100px] resize-none"
              maxLength={300}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {createApiForm.description.length}/300 자
            </div>
          </div>
          {/* 타입별 추가 입력 */}
          {renderCreateApiContent()}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleCreateApi} className="bg-blue-500 hover:bg-blue-600 text-white">
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiCreateModal;
