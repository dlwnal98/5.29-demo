import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Trash2, CheckCircle, XCircle, Settings, Shield } from 'lucide-react';
import type { Resource, Method, CorsSettings } from '@/types/resource';
import { CorsSettingsDialog } from './CorsSettingsDialog';

interface ResourceDetailCardProps {
  mockData2: any;
  selectedResource: Resource;
  setSelectedResource: (resource: Resource) => void;
  handleCorsClick: () => void;
  handleCreateMethod: () => void;
  handleMethodClick: (method: Method, resource: Resource) => void;
  setMethodToDelete: (method: Method) => void;
  setIsMethodDeleteDialogOpen: (open: boolean) => void;
  getMethodStyle: (method: any) => string;
  // CORS 관련 props 추가
  corsForm: CorsSettings;
  setCorsForm: (form: CorsSettings) => void;
  handleCorsUpdate: () => void;
  httpMethods: string[];
  addCorsMethod: (method: string) => void;
  removeCorsMethod: (method: string) => void;
}

export function ResourceDetailCard({
  mockData2,
  selectedResource,
  setSelectedResource,
  handleCorsClick,
  handleCreateMethod,
  handleMethodClick,
  setMethodToDelete,
  setIsMethodDeleteDialogOpen,
  getMethodStyle,
  corsForm,
  setCorsForm,
  handleCorsUpdate,
  httpMethods,
  addCorsMethod,
  removeCorsMethod,
}: ResourceDetailCardProps) {
  // CORS 다이얼로그 상태 추가
  const [isCorsModalOpen, setIsCorsModalOpen] = useState(false);

  // CORS 버튼 클릭 핸들러 수정
  const handleCorsButtonClick = () => {
    if (selectedResource.corsEnabled && selectedResource.corsSettings) {
      setCorsForm(selectedResource.corsSettings);
    }
    setIsCorsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Resource Details Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">리소스 세부 정보</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCorsButtonClick}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-300"
                title="리소스 수정">
                {/* <Settings className="h-4 w-4 text-gray-500" /> */}
                CORS 활성화 설정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMethodDeleteDialogOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                title="삭제">
                리소스 삭제
                {/* <Trash2 className="h-4 w-4" /> */}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                리소스 ID
              </Label>
              <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-400">
                {mockData2?._id}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">경로</Label>
              <div className="mt-1 text-lg font-mono text-gray-900 dark:text-white">
                {selectedResource.path}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CORS 활성화 여부
              </Label>
              <div className="mt-1 text-sm font-mono text-gray-600 dark:text-gray-400">
                {!selectedResource.corsEnabled ? (
                  <div className="flex items-center">
                    <Badge variant="outline" className={getStatusColor('active')}>
                      active
                    </Badge>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCorsButtonClick}
                      className="border-0 text-gray-600 hover:text-gray-700 hover:bg-transparent"
                      title="리소스 수정">
                      <Settings className="h-4 w-4 text-gray-500" />
                    </Button> */}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Badge variant="outline" className={getStatusColor('inactive')}>
                      inactive
                    </Badge>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCorsButtonClick}
                      className="border-0 text-gray-600 hover:text-gray-700 hover:bg-transparent"
                      title="리소스 수정">
                      <Settings className="h-4 w-4 text-gray-500" />
                    </Button> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Methods Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-gray-900 dark:text-white`}>
              메서드 ({selectedResource.methods.length})
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateMethod}
                className="bg-blue-500 hover:bg-blue-600 text-white">
                메서드 생성
              </Button>
            </div>
          </div>
          {selectedResource.methods.length > 0 ? (
            <Table>
              <TableHeader className="hover:bg-white dark:hover:bg-gray-700">
                <TableRow className="hover:bg-white dark:hover:bg-gray-700">
                  <TableHead>메서드 유형</TableHead>
                  <TableHead>API 키</TableHead>
                  <TableHead>엔드포인트 URL</TableHead>
                  <TableHead className="w-[100px]">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedResource.methods.map((method) => (
                  <TableRow
                    key={method.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell
                      onClick={() => {
                        handleMethodClick(method, selectedResource);
                      }}>
                      <span
                        className={`${getMethodStyle(method.type.toUpperCase())} font-mono text-sm px-2 py-1 rounded`}>
                        {method.type}
                      </span>
                    </TableCell>

                    <TableCell onClick={() => handleMethodClick(method, selectedResource)}>
                      {method.apiKey}
                    </TableCell>
                    <TableCell onClick={() => handleMethodClick(method, selectedResource)}>
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {method.endpointUrl}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMethodToDelete(method);
                          setIsMethodDeleteDialogOpen(true);
                        }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">메서드 없음</p>
              <p className="text-sm text-gray-500">정의된 메서드가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* CORS Settings Dialog */}
      <CorsSettingsDialog
        open={isCorsModalOpen}
        onOpenChange={setIsCorsModalOpen}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
        corsForm={corsForm}
        setCorsForm={setCorsForm}
        handleCorsUpdate={handleCorsUpdate}
        httpMethods={httpMethods}
        addCorsMethod={addCorsMethod}
        removeCorsMethod={removeCorsMethod}
      />
    </>
  );
}
