'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useCreateStageForm } from '../hooks/useCreateStageForm';
import { useDeploymentResourceTree } from '../hooks/useDeploymentResourceTree';
import { DeploymentResourceTreeItem } from './DeploymentResourceTreeItem';

interface CreateStageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenantId: string;
    userKey: string;
    apiId: string;
    onSuccess?: () => void;
    deploymentHistoryData: any;
}

export default function CreateStageDialog({
    open,
    onOpenChange,
    tenantId,
    userKey,
    apiId,
    onSuccess,
    deploymentHistoryData,
}: CreateStageDialogProps) {
    const [showPreview, setShowPreview] = useState(false);

    const {
        createStageForm,
        setCreateStageForm,
        selectedDeploymentRecord,
        setSelectedDeploymentRecord,
        handleCreateStage,
        handleResetForm,
        isValid,
    } = useCreateStageForm({
        open,
        tenantId,
        userKey,
        apiId,
        onOpenChange,
        onSuccess,
        deploymentHistoryData,
    });

    const { resourceTree, isLoading: isPreviewLoading, isReady: isPreviewReady } = useDeploymentResourceTree(
        selectedDeploymentRecord,
        showPreview && !!selectedDeploymentRecord
    );

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setShowPreview(false);
        }
        onOpenChange(isOpen);
    };

    const handleReset = () => {
        setShowPreview(false);
        handleResetForm();
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className={`transition-all duration-300 ${showPreview ? 'sm:max-w-[900px]' : 'sm:max-w-[500px]'}`}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-blue-600">Stage Creation</DialogTitle>
                    </DialogHeader>

                    <div className={`${showPreview ? 'flex gap-6' : ''}`}>
                        {/* 왼쪽: 폼 영역 */}
                        <div className={`space-y-5 py-4 ${showPreview ? 'w-1/2 min-w-[400px]' : 'w-full'}`}>
                            <div>
                                <Label
                                    htmlFor="create-stage-name"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Stage Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="create-stage-name"
                                    value={createStageForm.name}
                                    onChange={(e) =>
                                        setCreateStageForm({
                                            ...createStageForm,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Enter stage name"
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="create-stage-description"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </Label>
                                <Textarea
                                    id="create-stage-description"
                                    value={createStageForm.description}
                                    onChange={(e) =>
                                        setCreateStageForm({
                                            ...createStageForm,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Enter stage description (optional)"
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label className="text-sm text-gray-600 dark:text-gray-300 block">
                                    Deployment Record Selection <span className="text-red-500">*</span>
                                </Label>

                                <div className="flex items-center gap-2 mt-2">
                                    <Select value={selectedDeploymentRecord} onValueChange={setSelectedDeploymentRecord}>
                                        <SelectTrigger className="h-[48px] flex-1">
                                            <SelectValue placeholder="Select deployment record" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {deploymentHistoryData?.content?.map((record) => (
                                                <SelectItem
                                                    key={record.deploymentId}
                                                    value={record.deploymentId}
                                                    className="cursor-pointer">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center text-left">
                                                            <span className="font-medium text-left">
                                                                {new Date(record?.deployedAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            ID : {record?.deploymentId}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-[48px] w-[48px] shrink-0"
                                        disabled={!selectedDeploymentRecord}
                                        onClick={() => setShowPreview(!showPreview)}
                                        title={showPreview ? "Close Preview" : "View Deployment Details"}
                                    >
                                        {showPreview ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽: 배포 상세 미리보기 */}
                        {showPreview && (
                            <div className="w-1/2 py-4 border-l border-gray-200 dark:border-gray-700 pl-6">
                                <div className="mb-3">
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Deployment Resource Preview
                                    </Label>
                                </div>
                                <div className="border rounded-lg bg-gray-50 dark:bg-gray-900 max-h-[400px] overflow-y-auto min-h-[200px]">
                                    {isPreviewLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                            <span className="ml-2 text-sm text-gray-500">Loading resource tree...</span>
                                        </div>
                                    ) : isPreviewReady && resourceTree[0] ? (
                                        <div className="p-3">
                                            <DeploymentResourceTreeItem resource={resourceTree[0]} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                                            No resources available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                handleOpenChange(false);
                                handleReset();
                            }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateStage}
                            disabled={!isValid}
                            variant={'default'}
                            className="transition-colors duration-200 ease-in-out">
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
