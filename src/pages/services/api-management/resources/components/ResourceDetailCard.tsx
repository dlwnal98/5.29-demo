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
import { DeleteResourceDialog } from './DeleteResourceDialog';
import { useNavigate } from 'react-router-dom';
import { getMethodStyle } from '@/libs/etc';
import { useAuthStore } from '@/stores/store';
import { useCorsSettingsDialog } from '../hooks/useCorsSettingsDialog';
import { useDeleteMethodDialog } from '../hooks/useDeleteMethodDialog';
import { useDeleteResourceDialog } from '../hooks/useDeleteResourceDialog';

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
  const userKey = userData?.userKey || '';
  const navigate = useNavigate();


  // Dialog open states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCorsModalOpen, setIsCorsModalOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<Method | null>(null);
  const [isMethodDeleteDialogOpen, setIsMethodDeleteDialogOpen] = useState(false);

  // CORS Settings Dialog hook
  const corsDialog = useCorsSettingsDialog({
    apiId: apiId,
    open: isCorsModalOpen,
    resourceId: selectedResource?.resourceId || '',
    userKey,
    selectedResource,
    onOpenChange: setIsCorsModalOpen,
    onCorsSettingsSaved,
  });

  // Delete Method Dialog hook
  const deleteMethodDialog = useDeleteMethodDialog({
    methodToDelete,
    userKey,
    onOpenChange: setIsMethodDeleteDialogOpen,
    setSelectedResource: setSelectedResource as any,
    onMethodDeleted,
  });

  // Delete Resource Dialog hook
  const deleteResourceDialog = useDeleteResourceDialog({
    apiId: apiId,
    resourceId: selectedResource?.resourceId || '',
    onOpenChange: setIsDeleteDialogOpen,
    setCreatedResourceId,
    onResourceDeleted,
  });


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-800 dark:text-green-200 dark:border-green-700';
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-800 dark:text-red-200 dark:border-red-700';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-800 dark:text-amber-200 dark:border-amber-700';
    }
  };

  console.log(selectedResource)


  return (
    <>
      <div className="min-h-[77vh] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Resource Details Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6  space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resource 상세 정보</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCorsModalOpen(true)}
                title="Resource Update"
                className={`rounded-full h-[25px] !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50`}>
                CORS 활성화 설정
              </Button>
              {selectedResource?.path !== '/' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="rounded-full h-[25px] !gap-1 border-2 border-red-500 text-red-600 font-bold hover:text-red-700 hover:bg-red-50"
                  title="Delete">
                  Resource 삭제
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                이름
              </Label>
              <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-400">
                {selectedResource?.name}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                ID
              </Label>
              <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-400">
                {selectedResource?.resourceId}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
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

          {selectedResource?.description && (
            <div className="col-span-2">
              <Label className="text-sm font-medium text-muted-foreground dark:text-gray-300">설명</Label>
              <div className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
                {selectedResource?.description}
              </div>
            </div>
          )}
          <div className="min-w-0">
            <Label className="text-sm font-medium text-muted-foreground dark:text-gray-300">경로</Label>
            <div className="mt-1 text-sm font-mono text-gray-900 dark:text-white break-all">
              {selectedResource?.path}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold text-gray-900 dark:text-white`}>
              Methods
              {selectedResource?.methods?.length > 0 && (
                <span>({selectedResource?.methods?.length})</span>
              )}
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  navigate(
                    `/services/api-management/resources/methods?apiId=${apiId}&resourceId=${selectedResource?.resourceId}&resourcePath=${selectedResource?.path}`
                  );
                }}
                className="rounded-full h-[28px] bg-blue-500 hover:bg-blue-600 text-white">
                Method 생성
              </Button>
            </div>
          </div>
          {selectedResource?.methods?.length > 0 ? (
            <Table>
              <TableHeader className="hover:bg-white dark:hover:bg-gray-700">
                <TableRow className="hover:bg-white dark:hover:bg-gray-700">
                  <TableHead className="w-[10%] text-center">유형</TableHead>
                  <TableHead className='text-center'>요약</TableHead>
                  <TableHead className='text-center'>통합 유형</TableHead>
                  <TableHead className='text-center'>API Key</TableHead>
                  <TableHead className='text-center'>Route Endpoint URL</TableHead>
                  <TableHead className="w-[7%] text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedResource?.methods.map((method) => {
                  return (

                    <TableRow
                      key={method.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => {
                        handleMethodClick(method, selectedResource);
                      }}>
                      <TableCell className='text-center'>
                        <span
                          className={`${getMethodStyle(method.type)}  font-mono text-sm px-2 py-1 rounded`}>
                          {method.type}
                        </span>
                      </TableCell>
                      <TableCell className='text-center'>{method?.info?.summary}</TableCell>
                      <TableCell className='text-center'>{method?.info['x-integration-type']}</TableCell>
                      <TableCell className='text-center' onClick={() => handleMethodClick(method, selectedResource)}>
                        {method?.info['x-api-key-required'] ? 'True' : 'False'}
                      </TableCell>
                      <TableCell className='text-center' onClick={() => handleMethodClick(method, selectedResource)}>
                        {method?.info['x-route-endpoint'] && (
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {method?.info['x-route-endpoint'] ?? ''}
                          </code>
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
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
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">Method 없음</p>
              <p className="text-sm text-gray-500">Method가 정의되지 않았습니다.</p>
            </div>
          )}
        </div>
      </div>

      <CorsSettingsDialog
        open={isCorsModalOpen}
        onOpenChange={setIsCorsModalOpen}
        corsForm={corsDialog.corsForm}
        selectedMethods={corsDialog.selectedMethods}
        isPending={corsDialog.isPending}
        onSaveCorsSettings={corsDialog.onSaveCorsSettings}
        onMethodToggle={corsDialog.onMethodToggle}
        onCommaSeparatedInputChange={corsDialog.onCommaSeparatedInputChange}
        onMaxAgeChange={corsDialog.onMaxAgeChange}
        onAllowCredentialsChange={corsDialog.onAllowCredentialsChange}
        onCorsEnabledChange={corsDialog.onCorsEnabledChange}
      />

      <DeleteMethodDialog
        open={isMethodDeleteDialogOpen}
        onOpenChange={setIsMethodDeleteDialogOpen}
        methodToDelete={methodToDelete}
        isPending={deleteMethodDialog.isPending}
        onDeleteMethod={deleteMethodDialog.onDeleteMethod}
      />

      <DeleteResourceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        resourcePath={selectedResource?.path || ''}
        isPending={deleteResourceDialog.isPending}
        onDeleteResource={deleteResourceDialog.onDeleteResource}
      />
    </>
  );
}
