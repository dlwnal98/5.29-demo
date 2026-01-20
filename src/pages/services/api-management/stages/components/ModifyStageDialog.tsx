'use client';

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
import { useModifyStageForm } from '../hooks/useModifyStageForm';

interface ModifyStageDialogProps {
    open: boolean;
    userKey: string;
    onOpenChange: (open: boolean) => void;
    stageDetailData: any;
    onSuccess?: () => void;
}

export default function ModifyStageDialog({
    open,
    userKey,
    onOpenChange,
    stageDetailData,
    onSuccess,
}: ModifyStageDialogProps) {
    const {
        editForm,
        setEditForm,
        handleEditSave,
        isValid,
    } = useModifyStageForm({
        stageDetailData,
        userKey,
        onOpenChange,
        onSuccess,
    });


    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-blue-600">Stage Modify</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-5">
                            <div>
                                <Label
                                    htmlFor="stage-name"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Stage Name
                                </Label>
                                <Input
                                    id="stage-name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="mt-2"
                                    disabled
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="stage-description"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Stage Description
                                </Label>
                                <Textarea
                                    id="stage-description"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="mt-2 min-h-[100px]"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditSave}
                            disabled={!isValid}
                            className="bg-blue-500 hover:bg-blue-600 text-white">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
