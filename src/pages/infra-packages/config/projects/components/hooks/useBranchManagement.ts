import { useState } from "react";
import { useCreateBranch, useDeleteBranch } from "@/hooks/use-config-data";

export function useBranchManagement() {
  const [newBranchName, setNewBranchName] = useState("");

  const { mutate: createBranchMutate } = useCreateBranch("admin", "configs_repo");
  const { mutate: deleteBranchMutate } = useDeleteBranch("admin", "configs_repo");

  const handleCreateBranch = () => {
    if (newBranchName.trim()) {
      createBranchMutate(
        { newBranchName: newBranchName.trim() },
        {
          onSuccess: (data) => {
            console.log("브랜치 생성 성공:", data);
            setNewBranchName("");
          },
          onError: (error) => {
            console.error("브랜치 생성 실패:", error);
          },
        }
      );
    }
  };

  const handleDeleteBranch = (branchName: string) => {
    if (confirm(`정말 ${branchName} 브랜치를 삭제하시겠습니까?`)) {
      deleteBranchMutate(
        { branchName },
        {
          onSuccess: () => {
            console.log("브랜치 삭제 성공");
          },
          onError: (err) => {
            console.error("브랜치 삭제 실패:", err);
          },
        }
      );
    }
  };

  const isCreateDisabled = !newBranchName.trim();

  return {
    newBranchName,
    setNewBranchName,
    handleCreateBranch,
    handleDeleteBranch,
    isCreateDisabled,
  };
}
