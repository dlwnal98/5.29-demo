'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronDown, Search, ChevronLeft, SearchCode, Settings } from 'lucide-react';
import ActiveDeploymentChangeDialog from './ActiveDeploymentChangeDialog';
import DeploymentResourceTreeDialog from './DeploymentResourceTreeDialog';
import DeploymentListSettingsDialog from './DeploymentListSettingsDialog';
import { useDeploymentList } from '../hooks/useDeploymentList';

interface DeploymentListProps {
    selectedStage: any;
    onActiveDeploymentChanged?: () => Promise<void>;
    deploymentHistoryData: any;
    deploymentPage: number;
    setDeploymentPage: (page: number) => void;
    deploymentSize: number;
    setDeploymentSize: (size: number) => void;
}

export default function DeploymentList({
    selectedStage,
    onActiveDeploymentChanged,
    deploymentHistoryData,
    deploymentPage,
    setDeploymentPage,
    deploymentSize,
    setDeploymentSize,
}: DeploymentListProps) {
    const {
        userData,
        tenantId,
        filteredDeployments,
        paginatedDeployments,
        selectedDeploymentData,
        selectedDeploymentId,
        setSelectedDeploymentId,
        deploymentSearchTerm,
        setDeploymentSearchTerm,
        currentPage,
        isActiveDeploymentModalOpen,
        setIsActiveDeploymentModalOpen,
        isDeploymentResourceTreeOpen,
        setIsDeploymentResourceTreeOpen,
        isSettingsDialogOpen,
        setIsSettingsDialogOpen,
        columnVisibility,
        setColumnVisibility,
        totalPages,
        totalElements,
        startIndex,
        itemsPerPage,
        handleDeploymentSelect,
        handleActiveDeploymentChange,
        handleDetailDeployment,
        handlePreviousPage,
        handleNextPage,
        handleOpenSettings,
        handleItemsPerPageChange,
    } = useDeploymentList({
        deploymentHistoryData,
        deploymentPage,
        setDeploymentPage,
        deploymentSize,
        setDeploymentSize,
    });

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            배포 목록 ({filteredDeployments?.length})
                        </h2>
                        <div className='flex items-center'>
                            <Button
                                onClick={handleActiveDeploymentChange}
                                disabled={!selectedDeploymentId}
                                className="rounded-full h-[25px] bg-white !gap-1 border-2 border-blue-500 text-[#0F74E1] font-bold hover:text-blue-700 hover:bg-blue-50 disabled:border-gray-500 disabled:text-gray-700 disabled:bg-gray-100">
                                활성 배포 변경
                            </Button>
                            <Button
                                onClick={handleOpenSettings}
                                className="bg-white border-none text-gray-700 font-bold hover:bg-white">
                                <Settings />
                            </Button>
                        </div>

                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="배포 날짜 또는 배포 ID 검색"
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
                        {columnVisibility.deployedAt && (
                            <div className="col-span-3 text-center">
                                배포 날짜
                            </div>
                        )}
                        {columnVisibility.description && (
                            <div className="col-span-4 text-center">
                                배포 설명
                            </div>
                        )}
                        {columnVisibility.status && (
                            <div className="col-span-1 text-center">
                                상태
                            </div>
                        )}
                        {columnVisibility.deploymentId && (
                            <div className="col-span-2 text-center">
                                배포 ID
                            </div>
                        )}
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
                                {columnVisibility.deployedAt && (
                                    <div className="col-span-3 text-sm text-gray-900 dark:text-white text-center">
                                        {new Date(deployment.deployedAt).toLocaleString()}
                                    </div>
                                )}
                                {columnVisibility.description && (
                                    <div className="col-span-4 text-sm text-gray-900 dark:text-white text-center">
                                        {deployment?.metadata?.deploymentReason}
                                    </div>
                                )}
                                {columnVisibility.status && (
                                    <div className="col-span-1 text-center">
                                        {selectedStage.activeDeploymentId === deployment.deploymentId ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                                <span className="text-sm text-green-700">활성</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">-</span>
                                        )}
                                    </div>
                                )}
                                {columnVisibility.deploymentId && (
                                    <div className="col-span-2 text-sm font-mono text-gray-900 dark:text-white text-center">
                                        {deployment.deploymentId}
                                    </div>
                                )}
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
                            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalElements)} of{' '}
                            {totalElements}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="disabled:bg-gray-50">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium">{currentPage}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
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
                tenantId={tenantId}
                userKey={userData?.userKey || ''}
                apiId={selectedStage?.apiId || ''}
                selectedStage={selectedStage}
                selectedDeploymentData={selectedDeploymentData}
                setSelectedDeploymentId={setSelectedDeploymentId}
                selectedDeploymentId={selectedDeploymentId}
                onActiveDeploymentChanged={onActiveDeploymentChanged}
            />

            {/* Settings Dialog */}
            <DeploymentListSettingsDialog
                open={isSettingsDialogOpen}
                onOpenChange={setIsSettingsDialogOpen}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
            />
        </>
    );
}
