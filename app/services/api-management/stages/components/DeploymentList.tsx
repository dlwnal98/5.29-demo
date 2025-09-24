'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, ChevronDown, Search, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/store';
import { useGetDeployHistoryData } from '@/hooks/use-stages';
import ActiveDeploymentChangeDialog from './ActiveDeloymentChangeDialog';

interface DeploymentListProps {
  selectedStage: any;
}

export default function DeploymentList({ selectedStage }: DeploymentListProps) {
  const userData = useAuthStore((state) => state.user);

  const { data: deploymentHistoryData } = useGetDeployHistoryData(
    userData?.organizationId || '',
    0,
    20
  );
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);

  const [expandedDeployments, setExpandedDeployments] = useState<Set<string>>(new Set());
  const [deploymentSearchTerm, setDeploymentSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveDeploymentModalOpen, setIsActiveDeploymentModalOpen] = useState(false);
  const itemsPerPage = 10;
  // 배포 기록 관련 함수들
  const filteredDeployments = deploymentHistoryData?.filter(
    (deployment) =>
      deployment.deploymentId.toLowerCase().includes(deploymentSearchTerm.toLowerCase()) ||
      deployment.description.toLowerCase().includes(deploymentSearchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredDeployments?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeployments = filteredDeployments?.slice(startIndex, startIndex + itemsPerPage);

  // Get current active deployment
  const currentActiveDeployment = deploymentHistoryData?.find((d) => d.status === 'ACTIVE');
  const selectedDeploymentData = selectedDeployment
    ? deploymentHistoryData?.find((d) => d.deploymentId === selectedDeployment)
    : null;

  const handleDeploymentSelect = (deploymentId: string) => {
    setSelectedDeployment(deploymentId);
  };

  const toggleDeploymentExpansion = (deploymentId: string) => {
    const newExpanded = new Set(expandedDeployments);
    if (newExpanded.has(deploymentId)) {
      newExpanded.delete(deploymentId);
    } else {
      newExpanded.add(deploymentId);
    }
    setExpandedDeployments(newExpanded);
  };

  const handleActiveDeploymentChange = () => {
    if (!selectedDeployment) return;
    setIsActiveDeploymentModalOpen(true);
  };

  //   const renderDeploymentResourceTree = (resource: ApiResource, level = 0) => {
  //     const hasChildren =
  //       (resource.children && resource.children.length > 0) ||
  //       (resource.methods && resource.methods.length > 0);

  //     return (
  //       <div key={resource.id} className="ml-4">
  //         <div className="flex items-center gap-2 py-1 text-sm">
  //           <span className="text-gray-600">{resource.path}</span>
  //         </div>
  //         {resource.methods && resource.methods.length > 0 && (
  //           <div className="ml-4 space-y-1">
  //             {resource.methods?.map((method) => (
  //               <div key={method.id} className="flex items-center gap-2 py-1">
  //                 <span
  //                   className={`px-2 py-1 rounded text-xs font-mono ${
  //                     method.type === 'GET'
  //                       ? 'bg-green-100 text-green-800'
  //                       : method.type === 'POST'
  //                         ? 'bg-blue-100 text-blue-800'
  //                         : method.type === 'PUT'
  //                           ? 'bg-yellow-100 text-yellow-800'
  //                           : method.type === 'DELETE'
  //                             ? 'bg-red-100 text-red-800'
  //                             : 'bg-gray-100 text-gray-800'
  //                   }`}>
  //                   {method.type}
  //                 </span>
  //                 <span className="text-sm text-gray-600">{method.description}</span>
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //         {resource.children?.map((child) => renderDeploymentResourceTree(child, level + 1))}
  //       </div>
  //     );
  //   };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              배포 ({filteredDeployments?.length})
            </h2>
            <Button
              onClick={handleActiveDeploymentChange}
              className="rounded-full h-[25px] bg-white !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50">
              활성 배포 변경
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="배포 찾기"
              value={deploymentSearchTerm}
              onChange={(e) => setDeploymentSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="p-4 pt-0">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div className="col-span-1"></div>
            <div className="col-span-5">
              배포 날짜
              <ChevronDown className="inline h-4 w-4 ml-1" />
            </div>
            <div className="col-span-2">
              상태
              <ChevronDown className="inline h-4 w-4 ml-1" />
            </div>

            <div className="col-span-3">
              배포 ID
              <ChevronDown className="inline h-4 w-4 ml-1" />
            </div>
            <div className="col-span-1"></div>
          </div>
          {/* Deployment Rows */}
          <div className="space-y-0">
            {paginatedDeployments?.map((deployment: any) => (
              <Collapsible
                key={deployment.deploymentId}
                open={expandedDeployments.has(deployment.deploymentId)}
                onOpenChange={() => toggleDeploymentExpansion(deployment.deploymentId)}>
                <div
                  className={
                    selectedDeployment === deployment.deploymentId
                      ? 'grid grid-cols-12 gap-4 py-3 px-3  cursor-pointer bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                      : 'grid grid-cols-12 gap-4 py-3 px-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer'
                  }>
                  <div className="col-span-1 flex items-center">
                    <input
                      type="radio"
                      name="deployment"
                      checked={selectedDeployment === deployment.deploymentId}
                      onChange={() => handleDeploymentSelect(deployment.deploymentId)}
                      className="h-4 w-4 hover:cursor-pointer ext-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="col-span-5 text-sm text-gray-900 dark:text-white">
                    {deployment.deployedAt}
                  </div>
                  <div className="col-span-2">
                    {selectedStage.deploymentId === deployment.deploymentId ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">활성</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </div>

                  <div className="col-span-3 text-sm font-mono text-gray-900 dark:text-white">
                    {deployment.deploymentId}
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedDeployments.has(deployment.deploymentId) ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <CollapsibleContent>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      배포 상세 설명
                    </h4>
                    {deployment.resources && deployment.resources.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          리소스 목록
                        </h5>
                        <div className="bg-white dark:bg-gray-800 rounded border p-3">
                          {/* {deployment.resources?.map((resource) =>
                          renderDeploymentResourceTree(resource)
                        )} */}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDeployments?.length)} of{' '}
              {filteredDeployments?.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{currentPage}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deployment Change Modal */}
      <ActiveDeploymentChangeDialog
        open={isActiveDeploymentModalOpen}
        onOpenChange={setIsActiveDeploymentModalOpen}
        userKey={userData?.userKey || ''}
        selectedStage={selectedStage}
        currentActiveDeployment={currentActiveDeployment}
        selectedDeploymentData={selectedDeploymentData}
        setSelectedDeployment={setSelectedDeployment}
        selectedDeployment={selectedDeployment}
      />
    </>
  );
}
