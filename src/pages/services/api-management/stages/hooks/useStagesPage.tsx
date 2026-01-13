import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useClipboard } from "use-clipboard-copy";
import { useAuthStore } from "@/stores/store";
import { useGetStagesDocData } from "@/hooks/use-stages";
import { buildTree } from "@/libs/etc";
import { requestGet } from "@/libs/apiClient";
import { useGetStagesListData } from "@/hooks/use-stages";

interface ApiResource {
  id: string;
  path: string;
  name: string;
  children?: ApiResource[];
  methods: ApiMethod[];
  stageId?: string;
  deploymentId?: string;
  description?: string;
}

interface ApiMethod {
  id: string;
  type: string;
  path: string;
  endpointUrl: string;
  description: string;
  info?: {
    summary?: string;
  };
}

interface SelectedWholeStageInfo {
  resource: Partial<ApiResource>;
  type: "stage" | "resource";
}

interface SelectedMethod {
  resourceId: string;
  resourcePath: string;
  method: ApiMethod;
  url: string;
}

export function useStagesPage() {
  const userData = useAuthStore((state) => state.user);
  const userKey = userData?.userKey || "";
  const tenantId = userData?.organizationId ?? "kwwwksAsvmas";
  const [searchParams] = useSearchParams();
  const apiId = searchParams.get("apiId") || "";
  const stageId = "0rsCzZzPY6li";
  const { pathname } = useLocation();
  const clipboard = useClipboard();

  const { data: stagesListData } = useGetStagesListData(apiId);
  const { data: stagesDocData = [] } = useGetStagesDocData(stageId);

  console.log(stagesListData)

  const [selectedWholeStageInfo, setSelectedWholeStageInfo] =
    useState<SelectedWholeStageInfo>({
      resource: {},
      type: "stage",
    });
  const [selectedMethod, setSelectedMethod] = useState<SelectedMethod | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["hello"]));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateStageModalOpen, setIsCreateStageModalOpen] = useState(false);
  const [isDeleteStageDialogOpen, setIsDeleteStageDialogOpen] = useState(false);
  const [selectedStageEndpointUrl, setSelectedStageEndpointUrl] = useState("");

  // const resourceTree = useMemo(() => buildTree(stagesDocData), [stagesDocData]);
  const resourceTree = [];

  const getFinalEndpoint = useCallback(async (stageId: string) => {
    if (!stageId) return;
    const res = await requestGet(`/api/v1/gateway/stage/${stageId}`);
    setSelectedStageEndpointUrl(res.data.baseUrl);
  }, []);

  const prevLengthRef = useRef(0);

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

  console.log(resourceTree)

  // useEffect(() => {

  //   if (resourceTree?.length === 0) return;

  //   const prevLength = prevLengthRef.current;
  //   prevLengthRef.current = resourceTree.length;

  //   const currentId = selectedWholeStageInfo.resource?.deploymentId;
  //   const updated = currentId ? findResourceById(resourceTree, currentId) : null;

  //   if (!currentId) {
  //     getFinalEndpoint(resourceTree[0]?.stageId || "");
  //     setSelectedWholeStageInfo({ resource: resourceTree[0], type: "stage" });
  //     return;
  //   }

  //   if (!updated) {
  //     getFinalEndpoint(resourceTree[0]?.stageId || "");
  //     setSelectedWholeStageInfo({ resource: resourceTree[0], type: "stage" });
  //     return;
  //   }

  //   if (resourceTree.length > prevLength) {
  //     getFinalEndpoint(resourceTree[0]?.stageId || "");
  //     setSelectedWholeStageInfo({ resource: resourceTree[0], type: "stage" });
  //     return;
  //   }

  //   getFinalEndpoint(updated?.stageId || "");
  //   setSelectedWholeStageInfo((prev) => ({
  //     ...prev,
  //     resource: updated,
  //   }));
  // }, [resourceTree, findResourceById, getFinalEndpoint, selectedWholeStageInfo.resource?.deploymentId]);

  const getResourceKey = useCallback(
    (resource: ApiResource, parentPath = "") => {
      return `${parentPath}${resource.path}-${resource.id}`;
    },
    []
  );

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

  const handleCopyUrl = useCallback(() => {
    clipboard.copy(selectedStageEndpointUrl);
    toast.success("URL이 클립보드에 복사되었습니다.");
  }, [clipboard, selectedStageEndpointUrl]);

  const handleCopyMethodUrl = useCallback(
    (url: string) => {
      clipboard.copy(url);
      toast.success("메서드 URL이 클립보드에 복사되었습니다.");
    },
    [clipboard]
  );

  const handleExportApi = useCallback(() => {
    toast.success("API 내보내기가 시작되었습니다.");
  }, []);

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
    // Data
    userKey,
    tenantId,
    apiId,
    resourceTree,
    stagesListData,
    selectedWholeStageInfo,
    selectedMethod,
    expandedPaths,
    selectedStageEndpointUrl,

    // Modal states
    isEditModalOpen,
    isCreateStageModalOpen,
    isDeleteStageDialogOpen,

    // Handlers
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
