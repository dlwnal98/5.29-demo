import { useBranchManagement } from "./hooks/useBranchManagement";
import BranchManagementModalView from "./BranchManagementModalView";
import { BranchListProps } from "@/types/config";

interface BranchManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: BranchListProps[];
}

export default function BranchManagementModal({
  isOpen,
  onClose,
  branches,
}: BranchManagementModalProps) {
  const {
    newBranchName,
    setNewBranchName,
    handleCreateBranch,
    handleDeleteBranch,
    isCreateDisabled,
  } = useBranchManagement();

  return (
    <BranchManagementModalView
      isOpen={isOpen}
      branches={branches}
      newBranchName={newBranchName}
      isCreateDisabled={isCreateDisabled}
      onClose={onClose}
      onNewBranchNameChange={setNewBranchName}
      onCreateBranch={handleCreateBranch}
      onDeleteBranch={handleDeleteBranch}
    />
  );
}
