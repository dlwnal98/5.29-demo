import { useDeleteStage } from "@/hooks/use-stages";
import { toast } from "sonner";

export function useDeleteStageAction({
    stageDetailData,
    onOpenChange,
    onSuccess,
}: {
    stageDetailData: any;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}) {
    const { mutate: deleteStage } = useDeleteStage({
        onSuccess: () => {
            toast.success('Stage deleted successfully.');
            onOpenChange(false);
            onSuccess?.();
        },
    });

    const handleDeleteStage = () => {
        if (stageDetailData)
            deleteStage({
                stageId: stageDetailData?.stageId,
            });
    };

    return {
        handleDeleteStage,
    };
}