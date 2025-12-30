import { useDeleteStage } from "@/hooks/use-stages";
import { toast } from "sonner";

export function useDeleteStageAction({
    selectedStage,
    userKey,
    onOpenChange,
}: {
    selectedStage: any;
    userKey: string;
    onOpenChange: (open: boolean) => void;
}) {
    const { mutate: deleteStage } = useDeleteStage({
        onSuccess: () => {
            toast.success('스테이지가 삭제되었습니다.');
            onOpenChange(false);
        },
    });

    const handleDeleteStage = () => {
        if (userKey && selectedStage)
            deleteStage({
                stageId: selectedStage?.stageId,
                deletedBy: userKey,
            });
    };

    return {
        handleDeleteStage,
    };
}