'use client';

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
import { Trash2, Shield } from 'lucide-react';
import type { Resource, Method } from '@/types/resource';
import { CorsSettingsDialog } from './CorsSettingsDialog';
import { DeleteMethodDialog } from './DeleteMethodDialog';
import { useRouter } from 'next/navigation';
import { getMethodStyle } from '@/lib/etc';
import { DeleteResourceDialog } from './DeleteResourceDialog';
import { useAuthStore } from '@/store/store';

interface ResourceDetailCardProps {
  selectedResource: Resource;
  setSelectedResource: (resource: Resource) => void;
  handleMethodClick: (method: Method, resource: Resource) => void;
  apiId: string;
  setCreatedResourceId: React.Dispatch<React.SetStateAction<string>>;
  onMethodDeleted?: () => void;
  onResourceDeleted?: () => void;
  onCorsSettingsSaved?: () => void;
}

export function ResourceDetailCard({
  selectedResource,
  setSelectedResource,
  handleMethodClick,
  apiId,
  setCreatedResourceId,
  onMethodDeleted,
  onResourceDeleted,
  onCorsSettingsSaved,
}: ResourceDetailCardProps) {
  const userData = useAuthStore((state) => state.user);

  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCorsModalOpen, setIsCorsModalOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<Method | null>(null);
  const [isMethodDeleteDialogOpen, setIsMethodDeleteDialogOpen] = useState(false);

  // CORS 버튼 클릭 핸들러 수정
  const handleCorsButtonClick = () => {
    // if (selectedResource.corsEnabled && selectedResource.corsSettings) {
    // setCorsForm(selectedResource.corsSettings);
    // }
    setIsCorsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  console.log(selectedResource);

  return (
    <>
      <div className="min-h-[77vh] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Resource Details Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6  space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">리소스 세부 정보</h2>
            <div className="flex items-center gap-3">
              {selectedResource?.cors && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCorsButtonClick}
                  title="리소스 수정"
                  className="rounded-full h-[25px] !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50">
                  CORS 활성화 설정
                </Button>
              )}
              {selectedResource?.path !== '/' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="rounded-full h-[25px] !gap-1 border-2 border-red-500 text-red-600 font-bold hover:text-red-700 hover:bg-red-50"
                  title="삭제">
                  리소스 삭제
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className={`${selectedResource?.description ? 'col-span-1' : 'col-span-3'}`}>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                리소스 이름
              </Label>
              <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-400">
                {selectedResource?.name}
              </div>
            </div>
            {selectedResource?.description && (
              <div className="col-span-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">설명</Label>
                <div className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
                  {selectedResource?.description}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                리소스 ID
              </Label>
              <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-400">
                {selectedResource?.resourceId}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">경로</Label>
              <div className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
                {selectedResource?.path}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CORS 활성화 여부
              </Label>
              <div className="mt-1 text-sm font-mono text-gray-600 dark:text-gray-400">
                {selectedResource?.cors ? (
                  <div className="flex items-center">
                    <Badge variant="outline" className={getStatusColor('active')}>
                      active
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Badge variant="outline" className={getStatusColor('inactive')}>
                      inactive
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-gray-900 dark:text-white`}>
              메서드
              {selectedResource?.methods?.length > 0 && (
                <span>({selectedResource?.methods?.length})</span>
              )}
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  router.push(
                    `/services/api-management/resources/methods?apiId=${apiId}&resourceId=${selectedResource?.resourceId}&resourcePath=${selectedResource?.path}`
                  );
                }}
                className="rounded-full h-[28px] bg-blue-500 hover:bg-blue-600 text-white">
                메서드 생성
              </Button>
            </div>
          </div>
          {selectedResource?.methods?.length > 0 ? (
            <Table>
              <TableHeader className="hover:bg-white dark:hover:bg-gray-700">
                <TableRow className="hover:bg-white dark:hover:bg-gray-700">
                  <TableHead className="w-[10%]">메서드 유형</TableHead>
                  <TableHead>메서드 이름</TableHead>
                  <TableHead>API 키</TableHead>
                  <TableHead>엔드포인트 URL</TableHead>
                  <TableHead className="w-[7%] text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedResource?.methods.map((method) => (
                  <TableRow
                    key={method.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => {
                      handleMethodClick(method, selectedResource);
                    }}>
                    <TableCell>
                      <span
                        className={`${getMethodStyle(method.type)}  font-mono text-sm px-2 py-1 rounded`}>
                        {method.type}
                      </span>
                    </TableCell>
                    <TableCell>{method?.info?.summary}</TableCell>
                    <TableCell onClick={() => handleMethodClick(method, selectedResource)}>
                      {method?.info['x-api-key-required'] ? 'True' : 'False'}
                    </TableCell>
                    <TableCell onClick={() => handleMethodClick(method, selectedResource)}>
                      {method?.info['x-backend-endpoint'] && (
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {method?.info['x-backend-endpoint'] ?? ''}
                        </code>
                      )}
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

      <CorsSettingsDialog
        open={isCorsModalOpen}
        onOpenChange={setIsCorsModalOpen}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
        resourceId={selectedResource?.resourceId}
        userKey={userData?.userKey || ''}
        onCorsSettingsSaved={onCorsSettingsSaved}
      />

      <DeleteMethodDialog
        open={isMethodDeleteDialogOpen}
        onOpenChange={setIsMethodDeleteDialogOpen}
        methodToDelete={methodToDelete}
        apiId={apiId}
        userKey={userData?.userKey || ''}
        setMethodToDelete={setMethodToDelete}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
        onMethodDeleted={onMethodDeleted}
      />

      <DeleteResourceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        resourceId={selectedResource?.resourceId}
        selectedResource={selectedResource}
        setCreatedResourceId={setCreatedResourceId}
        onResourceDeleted={onResourceDeleted}
      />
    </>
  );
}
