import { useDeleteStage } from "@/hooks/use-stages";
import { toast } from "sonner";

export function useDeleteStageAction({
    stageDetailData,
    userKey,
    onOpenChange,
    onSuccess,
}: {
    stageDetailData: any;
    userKey: string;
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
        if (userKey && stageDetailData)
            deleteStage({
                stageId: stageDetailData?.stageId,
            });
    };

    return {
        handleDeleteStage,
    };
}