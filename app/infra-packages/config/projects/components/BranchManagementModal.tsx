"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Plus, Trash2 } from "lucide-react";
import { BranchListProps } from "@/types/config";
import { useCreateBranch, useDeleteBranch } from "@/hooks/use-config-data";

export default function BranchManagementModal({
  isOpen,
  onClose,
  branches,
}: {
  isOpen: boolean;
  onClose: () => void;
  branches: BranchListProps[];
}) {
  const [newBranchName, setNewBranchName] = useState("");

  // 브랜치 생성
  const { mutate: createBranchMutate } = useCreateBranch(
    "admin",
    "configs_repo"
  );

  const handleCreateBranch = () => {
    if (newBranchName.trim()) {
      createBranchMutate(
        {
          newBranchName: newBranchName.trim(),
        },
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

  // 브랜치 삭제
  const { mutate: deleteBranchMutate } = useDeleteBranch(
    "admin",
    "configs_repo"
  );

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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-blue-600" />
            Branch Management
          </DialogTitle>
          <DialogDescription>
            Create new branches or delete existing ones
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Branch */}
          <div className="border rounded-lg p-4 bg-blue-50/50">
            <h4 className="font-medium text-blue-900 mb-3">
              Create New Branch
            </h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter branch name"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCreateBranch}
                disabled={!newBranchName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          </div>

          {/* Existing Branches */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Existing Branches
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {branches.map((branch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4 text-gray-500" />
                    <span className="font-mono text-sm">{branch.name}</span>
                    {branch.name === "main" && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  {branch.name !== "main" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBranch(branch.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
