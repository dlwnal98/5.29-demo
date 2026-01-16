import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ModelData } from '@/apis/models.api';

interface ModelsPageViewProps {
  models: ModelData[];
  onCreate: () => void;
  onEdit: (model: ModelData) => void;
  onDelete: (model: ModelData) => void;
}

export default function ModelsPageView({
  models,
  onCreate,
  onEdit,
  onDelete,
}: ModelsPageViewProps) {
  console.log(models)
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
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

      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Models</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">API 모델 스키마를 관리하세요.</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onCreate}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4" />
            모델 생성
          </Button>
        </div>
      </div>

      {/* Models 리스트 */}
      <Card className="dark:border-gray-700">
        <div className="pt-4"></div>
        <CardContent>
          <Table>
            <TableHeader className="hover:bg-white dark:hover:bg-transparent dark:border-gray-700">
              <TableRow className="hover:bg-white dark:hover:bg-transparent dark:border-gray-700">
                <TableHead className="w-[15%] text-center">ID</TableHead>
                <TableHead className="w-[20%] text-center">이름</TableHead>
                <TableHead className="text-center">설명</TableHead>
                <TableHead className="w-[12%] text-center">생성일자</TableHead>
                <TableHead className="w-[10%] text-center">수정</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models?.length > 0 ? (
                models.map((model) => (
                  <TableRow
                    key={model.modelId}
                    className="hover:bg-white dark:hover:bg-transparent dark:border-gray-700"
                  >
                    <TableCell className="font-mono text-sm text-center font-medium text-blue-600">{model.modelId}</TableCell>
                    <TableCell className="text-center">{model.modelName}</TableCell>
                    <TableCell className="text-center">{model.description}</TableCell>
                    <TableCell className="text-center">{new Date(model.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-end">
                        <Button
                          className="text-white hover:text-white bg-slate-500 hover:bg-slate-500"
                          size="sm"
                          onClick={() => onEdit(model)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(model)}
                          className="bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-white dark:hover:bg-gray-800">
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    등록된 모델이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
