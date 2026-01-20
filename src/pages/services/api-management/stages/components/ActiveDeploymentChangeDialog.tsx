'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Toaster } from 'sonner';
import { ChevronsRight } from 'lucide-react';
import { useActiveDeploymentChange } from '../hooks/useActiveDeploymentChange';

interface ActiveDeploymentChangeProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenantId: string;
    userKey: string;
    apiId: string;
    selectedStage: any;
    selectedDeploymentData: any;
    setSelectedDeploymentId: (value: string | null) => void;
    selectedDeploymentId: string | null;
    onActiveDeploymentChanged?: () => Promise<void>;
}

export default function ActiveDeploymentChangeDialog({
    open,
    onOpenChange,
    userKey,
    selectedStage,
    selectedDeploymentData,
    setSelectedDeploymentId,
    selectedDeploymentId,
    onActiveDeploymentChanged,
}: ActiveDeploymentChangeProps) {
    const { confirmActiveDeploymentChange } = useActiveDeploymentChange({
        userKey,
        selectedStage,
        selectedDeploymentId,
        onOpenChange,
        setSelectedDeploymentId,
        onActiveDeploymentChanged,
    });

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-blue-600 mb-2">
                                Active Deployment Change
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 pb-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mr-1">
                                {selectedStage.name}
                            </span>
                            Update the active deployment of the stage?
                            <div className="text-xs text-red-400 dark:text-red-400 font-medium mt-2">
                                * The current active deployment will be immediately replaced by the new deployment.
                            </div>
                        </div>

                        <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 p-5 px-8 rounded">
                            <div>
                                <div className="text-sm font-bold text-center text-gray-900 dark:text-white mb-1">
                                    Current Active Deployment
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                    {selectedStage?.activeDeploymentId || '-'}
                                </div>
                            </div>
                            <div className="flex items-center space-x-[-13px] mx-auto">
                                <ChevronsRight className="text-blue-500 mt-0 w-8 h-8" />
                                <ChevronsRight className="text-blue-500 mt-0 w-8 h-8" />
                                <ChevronsRight className="text-blue-500 mt-0 w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-center text-gray-900 dark:text-white mb-1">
                                    New Active Deployment
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                    {selectedDeploymentData?.deploymentId}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmActiveDeploymentChange} variant={'default'}>
                            Change
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
