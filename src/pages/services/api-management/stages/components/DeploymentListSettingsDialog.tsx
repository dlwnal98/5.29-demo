'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface ColumnVisibility {
    deployedAt: boolean;
    status: boolean;
    description: boolean;
    deploymentId: boolean;
}

interface DeploymentListSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (value: number) => void;
    columnVisibility: ColumnVisibility;
    onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
}

export default function DeploymentListSettingsDialog({
    open,
    onOpenChange,
    itemsPerPage,
    onItemsPerPageChange,
    columnVisibility,
    onColumnVisibilityChange,
}: DeploymentListSettingsDialogProps) {
    const [tempItemsPerPage, setTempItemsPerPage] = useState<number>(itemsPerPage);
    const [tempColumnVisibility, setTempColumnVisibility] = useState<ColumnVisibility>(columnVisibility);

    useEffect(() => {
        if (open) {
            setTempItemsPerPage(itemsPerPage);
            setTempColumnVisibility(columnVisibility);
        }
    }, [open, itemsPerPage, columnVisibility]);

    const handleConfirm = () => {
        onItemsPerPageChange(tempItemsPerPage);
        onColumnVisibilityChange(tempColumnVisibility);
        onOpenChange(false);
    };

    const handleCancel = () => {
        setTempItemsPerPage(itemsPerPage);
        setTempColumnVisibility(columnVisibility);
        onOpenChange(false);
    };

    const handleColumnToggle = (column: keyof ColumnVisibility) => {
        setTempColumnVisibility((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">기본 설정</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8 pt-2 pb-5">
                    {/* 페이지 크기 선택 */}
                    <div className="space-y-4 border-r border-gray-200 dark:border-gray-700">
                        <Label className="text-base font-semibold text-gray-900 dark:text-white">
                            페이지 크기 선택
                        </Label>
                        <RadioGroup
                            value={String(tempItemsPerPage)}
                            onValueChange={(value) => setTempItemsPerPage(Number(value))}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="20" id="items-20" />
                                <Label htmlFor="items-20" className="text-sm font-normal cursor-pointer">
                                    20개 배포
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="30" id="items-30" />
                                <Label htmlFor="items-30" className="text-sm font-normal  cursor-pointer">
                                    30개 배포
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="50" id="items-50" />
                                <Label htmlFor="items-50" className="text-sm font-normal  cursor-pointer">
                                    50개 배포
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="100" id="items-100" />
                                <Label htmlFor="items-100" className="text-sm font-normal  cursor-pointer">
                                    100개 배포
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* 표시할 열 선택 */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold text-gray-900 dark:text-white">
                            표시할 열 선택
                        </Label>
                        <div className="space-y-1">
                            {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">배포 속성</p> */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-normal">배포 날짜</Label>
                                    <Switch
                                        checked={tempColumnVisibility.deployedAt}
                                        onCheckedChange={() => handleColumnToggle('deployedAt')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-normal">상태</Label>
                                    <Switch
                                        checked={tempColumnVisibility.status}
                                        onCheckedChange={() => handleColumnToggle('status')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-normal">설명</Label>
                                    <Switch
                                        checked={tempColumnVisibility.description}
                                        onCheckedChange={() => handleColumnToggle('description')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-normal">배포 ID</Label>
                                    <Switch
                                        checked={tempColumnVisibility.deploymentId}
                                        onCheckedChange={() => handleColumnToggle('deploymentId')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        취소
                    </Button>
                    <Button onClick={handleConfirm} >
                        확인
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
