'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronRight,
  ChevronDown,
  Search,
  ChevronLeft,
  FileCode2,
  SearchCode,
} from 'lucide-react';
import { useAuthStore } from '@/store/store';
import { useGetDeployHistoryData } from '@/hooks/use-stages';
import ActiveDeploymentChangeDialog from './ActiveDeloymentChangeDialog';
import DeploymentResourceTreeDialog from './DeploymentResourceTreeDialog';

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
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);

  const [expandedDeployments, setExpandedDeployments] = useState<Set<string>>(new Set());
  const [deploymentSearchTerm, setDeploymentSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveDeploymentModalOpen, setIsActiveDeploymentModalOpen] = useState(false);
  const [isDeploymentResourceTreeOpen, setIsDeploymentResourceTreeOpen] = useState(false);
  const itemsPerPage = 10;
  // 배포 기록 관련 함수들
  const filteredDeployments = deploymentHistoryData?.filter(
    (deployment) =>
      deployment.deploymentId?.toLowerCase()?.includes(deploymentSearchTerm.toLowerCase()) ||
      deployment.description?.toLowerCase()?.includes(deploymentSearchTerm.toLowerCase())
  );
  // 최신순 정렬
  const sortedDeployments = filteredDeployments
    ?.slice() // 원본 훼손 방지
    .sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime());

  const totalPages = Math.ceil(sortedDeployments?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeployments = sortedDeployments?.slice(startIndex, startIndex + itemsPerPage);

  // Get current active deployment
  const currentActiveDeployment = deploymentHistoryData?.find((d) => d.status === 'ACTIVE');
  const selectedDeploymentData = selectedDeploymentId
    ? deploymentHistoryData?.find((d) => d.deploymentId === selectedDeploymentId)
    : null;

  const handleDeploymentSelect = (deploymentId: string) => {
    if (selectedDeploymentId === deploymentId) setSelectedDeploymentId('');
    else setSelectedDeploymentId(deploymentId);
  };

  const handleActiveDeploymentChange = () => {
    if (!selectedDeploymentId) return;
    setIsActiveDeploymentModalOpen(true);
  };

  const handleDetailDeployment = (deploymentId: string, e: React.MouseEvent) => {
    console.log(1, deploymentId);
    e.stopPropagation();
    setSelectedDeploymentId(deploymentId);
    setIsDeploymentResourceTreeOpen(true);
  };

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
              disabled={!selectedDeploymentId}
              className="rounded-full h-[25px] bg-white !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50 disabled:border-gray-500 disabled:text-gray-700 disabled:bg-gray-100">
              활성 배포 변경
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="배포 날짜 혹은 배포 ID를 검색해주세요"
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
              <div
                className={
                  selectedDeploymentId === deployment.deploymentId
                    ? 'grid grid-cols-12 gap-4 py-3 px-3 cursor-pointer bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 transition-colors duration-200 ease-in-out'
                    : 'grid grid-cols-12 gap-4 py-3 px-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 ease-in-out'
                }
                onClick={() => handleDeploymentSelect(deployment.deploymentId)}>
                <div className="col-span-1 flex items-center">
                  <input
                    type="radio"
                    name="deployment"
                    checked={selectedDeploymentId === deployment.deploymentId}
                    onChange={() => handleDeploymentSelect(deployment.deploymentId)}
                    className="h-4 w-4 hover:cursor-pointer ext-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                </div>
                <div className="col-span-5 text-sm text-gray-900 dark:text-white">
                  {new Date(deployment.deployedAt).toLocaleString()}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => handleDetailDeployment(deployment.deploymentId, e)}>
                    <SearchCode />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDeployments?.length)} of{' '}
              {filteredDeployments?.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="disabled:bg-gray-50">
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

      <DeploymentResourceTreeDialog
        open={isDeploymentResourceTreeOpen}
        onOpenChange={setIsDeploymentResourceTreeOpen}
        selectedDeploymentId={selectedDeploymentId || ''}
      />

      {/* Active Deployment Change Modal */}
      <ActiveDeploymentChangeDialog
        open={isActiveDeploymentModalOpen}
        onOpenChange={setIsActiveDeploymentModalOpen}
        userKey={userData?.userKey || ''}
        selectedStage={selectedStage}
        currentActiveDeployment={currentActiveDeployment}
        selectedDeploymentData={selectedDeploymentData}
        setSelectedDeploymentId={setSelectedDeploymentId}
        selectedDeploymentId={selectedDeploymentId}
      />
    </>
  );
}
