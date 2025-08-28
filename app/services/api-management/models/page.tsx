'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Copy,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useClipboard } from 'use-clipboard-copy';
import CreateModelDialog from './components/CreateModelDialog';
import ModifyModelDialog from './components/ModifyModelDialog';
import DeleteModelDialog from './components/DeleteModelDialog';

interface Model {
  id: string;
  name: string;
  contentType: string;
  description: string;
  schema: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

const mockModels: Model[] = [
  {
    id: '1',
    name: 'Empty',
    contentType: 'application/json',
    description: 'This is a default empty schema model',
    schema: `{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Empty Schema",
  "type": "object"
}`,
    createdAt: '2024-01-15 14:44:23',
    updatedAt: '2024-01-15 14:44:23',
    usageCount: 5,
  },
  {
    id: '2',
    name: 'Error',
    contentType: 'application/json',
    description: 'This is a default error schema model',
    schema: `{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Error Schema",
  "type": "object",
  "properties": {
    "error": {
      "type": "object",
      "properties": {
        "code": {
          "type": "integer"
        },
        "message": {
          "type": "string"
        }
      },
      "required": ["code", "message"]
    }
  },
  "required": ["error"]
}`,
    createdAt: '2024-01-15 14:44:23',
    updatedAt: '2024-01-15 14:44:23',
    usageCount: 12,
  },
  {
    id: '3',
    name: 'User',
    contentType: 'application/json',
    description: 'User model with basic information',
    schema: `{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "User Schema",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["id", "name", "email"]
}`,
    createdAt: '2024-01-20 10:30:15',
    updatedAt: '2024-01-22 16:20:45',
    usageCount: 8,
  },
];

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Form states
  const [modelForm, setModelForm] = useState({
    name: '',
    contentType: 'application/json',
    description: '',
    schema: `{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "New Schema",
  "type": "object",
  "properties": {
    
  }
}`,
  });

  const clipboard = useClipboard();

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.contentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedModels([]);
      setIsAllSelected(false);
    } else {
      setSelectedModels(filteredModels.map((model) => model.id));
      setIsAllSelected(true);
    }
  };

  const handleSelectModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      const newSelected = selectedModels.filter((id) => id !== modelId);
      setSelectedModels(newSelected);
      setIsAllSelected(false);
    } else {
      const newSelected = [...selectedModels, modelId];
      setSelectedModels(newSelected);
      setIsAllSelected(newSelected.length === filteredModels.length);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedModels.length === 0) return;

    const modelsToDelete = models.filter((model) => selectedModels.includes(model.id));
    setModelToDelete(modelsToDelete.length === 1 ? modelsToDelete[0] : null);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelected = () => {
    const updatedModels = models.filter((model) => !selectedModels.includes(model.id));
    setModels(updatedModels);
    setSelectedModels([]);
    setIsAllSelected(false);
    setIsDeleteModalOpen(false);
    setModelToDelete(null);

    if (selectedModels.length === 1) {
      const deletedModel = models.find((m) => m.id === selectedModels[0]);
      toast.success(`모델 '${deletedModel?.name}'이(가) 삭제되었습니다.`);
    } else {
      toast.success(`${selectedModels.length}개의 모델이 삭제되었습니다.`);
    }

    if (selectedModels.includes(expandedModel || '')) {
      setExpandedModel(null);
    }
  };

  const handleModelClick = (model: Model) => {
    if (expandedModel === model.id) {
      setExpandedModel(null);
    } else {
      setExpandedModel(model.id);
    }
  };

  const openEditModal = (model: Model) => {
    setSelectedModel(model);
    setModelForm({
      name: model.name,
      contentType: model.contentType,
      description: model.description,
      schema: model.schema,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (model: Model) => {
    setModelToDelete(model);
    setIsDeleteModalOpen(true);
  };

  const copySchema = (schema: string) => {
    clipboard.copy(schema);
    toast.success('스키마가 클립보드에 복사되었습니다.');
  };

  const getSchemaByteCount = (schema: string) => {
    return new TextEncoder().encode(schema).length;
  };

  const renderModelForm = () => (
    <div className="space-y-6 py-4">
      {/* Model Name */}
      <div>
        <Label htmlFor="model-name" className="text-sm font-medium text-gray-700 mb-2 block">
          이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="model-name"
          placeholder="모델 이름을 입력하세요"
          value={modelForm.name}
          onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
          className="w-full"
        />
      </div>

      {/* Content Type */}
      <div>
        <Label htmlFor="content-type" className="text-sm font-medium text-gray-700 mb-2 block">
          콘텐츠 유형
        </Label>
        <Input
          id="content-type"
          value={modelForm.contentType}
          onChange={(e) => setModelForm({ ...modelForm, contentType: e.target.value })}
          className="w-full bg-gray-50"
          placeholder="application/json"
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
          설명 - 선택 사항
        </Label>
        <Textarea
          id="description"
          placeholder="모델에 대한 설명을 입력하세요"
          value={modelForm.description}
          onChange={(e) => setModelForm({ ...modelForm, description: e.target.value })}
          className="w-full min-h-[80px] resize-none"
          maxLength={500}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {modelForm.description.length}/500 자
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
                onClick={() => copySchema(modelForm.schema)}
                className="h-7 px-2">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-12 min-h-[400px]">
            {/* Line Numbers */}
            <div className="col-span-1 bg-gray-50 border-r p-2">
              <div className="font-mono text-xs text-gray-500 leading-5">
                {modelForm.schema.split('\n').map((_, index) => (
                  <div key={index} className="text-right pr-2">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
            {/* Schema Editor */}
            <div className="col-span-11 p-0">
              <Textarea
                value={modelForm.schema}
                onChange={(e) => setModelForm({ ...modelForm, schema: e.target.value })}
                className="w-full h-[400px] font-mono text-sm border-0 resize-none rounded-none focus:ring-0"
                placeholder="JSON 스키마를 입력하세요..."
              />
            </div>
          </div>
          <div className="bg-gray-50 px-3 py-2 border-t flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>⚠️ 0</span>
              <span>🔺 0</span>
            </div>
            <div>1:1 JSON 공백: {getSchemaByteCount(modelForm.schema)} bytes</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6 container px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services/api-management">API Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Models</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">모델</h1>
            <p className="text-gray-600 mt-1">
              모델을 사용하여 API에서 사용하는 다양한 요청 및 응답의 본문 형식을 정의합니다.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => {
                // resetForm();
                setIsCreateModalOpen(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              모델 생성
            </Button>
          </div>
        </div>

        {/* Models Table */}
        <Card>
          <div className="pt-4"></div>
          <CardContent>
            <Table>
              <TableHeader className="hover:bg-white">
                <TableRow className="hover:bg-white">
                  <TableHead>이름</TableHead>
                  <TableHead>콘텐츠 유형</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead className="text-center w-3">작업</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:nth-last-child(2)]:border-0">
                {filteredModels.length > 0 ? (
                  filteredModels.map((model) => (
                    <>
                      <TableRow
                        key={model.id}
                        className={`transition-colors ${
                          expandedModel === model.id
                            ? 'bg-blue-50  hover:bg-blue-50 hover:cursor-pointer border-l-4 border-b-0 border-blue-500'
                            : selectedModels.includes(model.id)
                              ? 'bg-gray-50 hover:cursor-pointer'
                              : ' hover:bg-blue-50 hover:cursor-pointer'
                        }`}
                        onClick={() => handleModelClick(model)}>
                        <TableCell>
                          <span className="font-medium text-blue-600">{model.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs bg-white">
                            {model.contentType}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <span className="text-gray-600 truncate block">{model.description}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(model);
                              }}
                              className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(model);
                              }}
                              className="h-8 w-8 p-0 text-red-600 bg-white hover:text-red-700 hover:bg-red-50 border-red-200">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            // onClick={() => handleModelClick(model)}
                            className="h-8 w-8 p-0">
                            {expandedModel === model.id ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Model Details */}
                      <TableRow
                        className={`${expandedModel === model.id ? 'table-row' : 'hidden'}`}>
                        <TableCell colSpan={6} className="p-0">
                          <Collapsible open={expandedModel === model.id}>
                            <CollapsibleContent className="transition-all duration-300 ease-in-out">
                              <div className="bg-gray-50 border-t p-6">
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      모델 세부 정보
                                    </h3>
                                  </div>

                                  <div className="grid grid-cols-3 gap-6 mb-6">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">
                                        이름
                                      </Label>
                                      <div className="mt-1 text-sm text-gray-900">{model.name}</div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">
                                        콘텐츠 유형
                                      </Label>
                                      <div className="mt-1">
                                        <Badge
                                          variant="outline"
                                          className="font-mono text-xs bg-white">
                                          {model.contentType}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">
                                        설명
                                      </Label>
                                      <div className="mt-1 text-sm text-gray-900">
                                        {model.description}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Schema Display */}
                                <div className="border rounded-lg overflow-hidden bg-white">
                                  <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                      JSON Schema
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copySchema(model.schema)}
                                      className="h-7 px-2">
                                      <Copy className="h-3 w-3 mr-1" />
                                      복사
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-12">
                                    {/* Line Numbers */}
                                    <div className="col-span-1 bg-gray-50 border-r p-3">
                                      <div className="font-mono text-xs text-gray-500 leading-5">
                                        {model.schema.split('\n').map((_, index) => (
                                          <div key={index} className="text-right pr-2">
                                            {index + 1}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    {/* Schema Content */}
                                    <div className="col-span-11 p-3">
                                      <pre className="font-mono text-xs text-gray-800 leading-5 overflow-x-auto">
                                        {model.schema}
                                      </pre>
                                    </div>
                                  </div>
                                </div>

                                {/* Model Stats */}
                                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      생성: {model.createdAt}
                                    </span>
                                    <span className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      수정: {model.updatedAt}
                                    </span>
                                    <span>사용 횟수: {model.usageCount}</span>
                                  </div>
                                  <div>크기: {getSchemaByteCount(model.schema)} bytes</div>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                      </TableRow>
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Model Modal */}
        <CreateModelDialog
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          renderModelForm={renderModelForm}
        />
        {/* Edit Model Modal */}

        <ModifyModelDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          renderModelForm={renderModelForm}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModelDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          selectedModels={selectedModels}
          modelToDelete={modelToDelete}
        />
      </div>
    </AppLayout>
  );
}
