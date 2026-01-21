import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useClipboard } from "use-clipboard-copy";
import type { ApiResource, ApiMethod, SelectedWholeStageInfo, SelectedMethod } from "../types";

interface UseStagesUIProps {
  resourceTree: ApiResource[];
  selectedStageEndpointUrl: string;
  getFinalEndpoint: (stageId: string) => Promise<void>;
}

/**
 * UI 상태 관리 로직을 담당하는 hook
 * - 모달 상태
 * - 선택 상태 (stage, resource, method)
 * - 확장/축소 상태
 * - 클립보드 복사 등의 UI 액션
 */
export function useStagesUI({
  resourceTree,
  selectedStageEndpointUrl,
  getFinalEndpoint,
}: UseStagesUIProps) {
  const clipboard = useClipboard();

  // 선택 상태
  const [selectedWholeStageInfo, setSelectedWholeStageInfo] =
    useState<SelectedWholeStageInfo>({
      resource: {},
      type: "stage",
    });
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["hello"]));

  // 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [isDeleteStageDialogOpen, setIsDeleteStageDialogOpen] = useState(false);

  const prevLengthRef = useRef(0);

  // Resource ID로 찾기
  const findResourceById = useCallback(
    (tree: ApiResource[], id: string): ApiResource | null => {
      for (const node of tree) {
        if (node.deploymentId === id) return node;
        if (node.children) {
          const found = findResourceById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  // Resource tree 변경 시 선택 상태 업데이트
  useEffect(() => {
    if (resourceTree.length === 0) return;

    const prevLength = prevLengthRef.current;
    prevLengthRef.current = resourceTree.length;

    const currentId = selectedWholeStageInfo.resource?.deploymentId;
    const updated = currentId ? findResourceById(resourceTree, currentId) : null;

    if (!currentId) {
      getFinalEndpoint(resourceTree[0]?.stageId || "");
      setSelectedWholeStageInfo({ resource: resourceTree[0], type: "stage" });
      return;
    }

    if (!updated) {
      getFinalEndpoint(resourceTree[0]?.stageId || "");
      setSelectedWholeStageInfo({ resource: resourceTree[0], type: "stage" });
      return;
    }

    if (resourceTree.length > prevLength) {
      getFinalEndpoint(resourceTree[0]?.stageId || "");
      setSelectedWholeStageInfo({ resource: resourceTree[0], type: "stage" });
      return;
    }

    getFinalEndpoint(updated?.stageId || "");
    setSelectedWholeStageInfo((prev) => ({
      ...prev,
      resource: updated,
    }));
  }, [resourceTree, findResourceById, getFinalEndpoint, selectedWholeStageInfo.resource?.deploymentId]);

  // Resource key 생성
  const getResourceKey = useCallback(
    (resource: ApiResource, parentPath = "") => {
      return `${parentPath}${resource.path}-${resource.id}`;
    },
    []
  );

  // Resource 클릭 핸들러
  const handleResourceClick = useCallback(
    (resource: ApiResource, type: "stage" | "resource") => {
      setSelectedWholeStageInfo({ resource, type });
      setSelectedMethod(null);
      if (type === "stage" && resource.stageId) {
        getFinalEndpoint(resource.stageId);
      }
    },
    [getFinalEndpoint]
  );

  // Method 클릭 핸들러
  const handleMethodClick = useCallback(
    (method: ApiMethod, resource: ApiResource) => {
      const methodUrl = `${selectedStageEndpointUrl}${resource.path}`;
      setSelectedMethod({
        resourceId: resource.id,
        resourcePath: resource.path,
        method,
        url: methodUrl,
      });
    },
    [selectedStageEndpointUrl]
  );

  // 트리 확장/축소 토글
  const toggleExpanded = useCallback(
    (resource: ApiResource, parentPath = "") => {
      const resourceKey = getResourceKey(resource, parentPath);
      setExpandedPaths((prev) => {
        const newExpanded = new Set(prev);
        if (newExpanded.has(resourceKey)) {
          newExpanded.delete(resourceKey);
        } else {
          newExpanded.add(resourceKey);
        }
        return newExpanded;
      });
    },
    [getResourceKey]
  );

  // URL 복사
  const handleCopyUrl = useCallback(() => {
    clipboard.copy(selectedStageEndpointUrl);
    toast.success("URL이 클립보드에 복사되었습니다.");
  }, [clipboard, selectedStageEndpointUrl]);

  // Method URL 복사
  const handleCopyMethodUrl = useCallback(
    (url: string) => {
      clipboard.copy(url);
      toast.success("Method URL이 클립보드에 복사되었습니다.");
    },
    [clipboard]
  );

  // API 내보내기
  const handleExportApi = useCallback(() => {
    toast.success("API 내보내기가 시작되었습니다.");
  }, []);

  // 모달 제어 핸들러들
  const handleOpenCreateModal = useCallback(() => {
    setIsCreateStageModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateStageModalOpen(false);
  }, []);

  const handleOpenEditModal = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleOpenDeleteDialog = useCallback(() => {
    setIsDeleteStageDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteStageDialogOpen(false);
  }, []);

  return {
    // 선택 상태
    selectedWholeStageInfo,
    selectedMethod,
    expandedPaths,

    // 모달 상태
    isEditModalOpen,
    isCreateStageModalOpen,
    isDeleteStageDialogOpen,

    // 핸들러
    onResourceClick: handleResourceClick,
    onMethodClick: handleMethodClick,
    onToggleExpanded: toggleExpanded,
    onCopyUrl: handleCopyUrl,
    onCopyMethodUrl: handleCopyMethodUrl,
    onExportApi: handleExportApi,
    onOpenCreateModal: handleOpenCreateModal,
    onCloseCreateModal: handleCloseCreateModal,
    onOpenEditModal: handleOpenEditModal,
    onCloseEditModal: handleCloseEditModal,
    onOpenDeleteDialog: handleOpenDeleteDialog,
    onCloseDeleteDialog: handleCloseDeleteDialog,
    getResourceKey,
  };
}
