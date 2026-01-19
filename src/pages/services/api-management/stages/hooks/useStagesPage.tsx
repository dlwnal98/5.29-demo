import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useClipboard } from "use-clipboard-copy";
import { useAuthStore } from "@/stores/store";
import { useGetStagesDocData } from "@/hooks/use-stages";
import { buildTree, resoureceBuildTree } from "@/libs/etc";
import { requestGet } from "@/libs/apiClient";
import { useGetStagesListData } from "@/hooks/use-stages";
import { getStagesOpenApiDocData, getStageDetailData } from "@/apis/stages.api";

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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedStageEndpointUrl, setSelectedStageEndpointUrl] = useState("");
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [stageResourcesMap, setStageResourcesMap] = useState<Record<string, any[]>>({});
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [expandedResources, setExpandedResources] = useState<string[]>([]);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [selectedTreeMethod, setSelectedTreeMethod] = useState<any | null>(null);
  const [stageDetailData, setStageDetailData] = useState<any | null>(null);


  // const { data: stagesDocData = [] } = useGetStagesDocData(selectedStageId);


  const getFinalEndpoint = useCallback(async (stageId: string) => {
    if (!stageId) return;
    const res = await requestGet(`/api/v1/gateway/stage/${stageId}`);
    setSelectedStageEndpointUrl(res.data.baseUrl);
  }, []);

  const prevLengthRef = useRef(0);
  const initializedRef = useRef(false);
  const pendingDeleteSelectionRef = useRef(false);
  const pendingCreateSelectionRef = useRef(false);

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
    toast.success("URL copied to clipboard.");
  }, [clipboard, selectedStageEndpointUrl]);

  const handleCopyMethodUrl = useCallback(
    (url: string) => {
      clipboard.copy(url);
      toast.success("Method URL copied to clipboard.");
    },
    [clipboard]
  );

  const handleStageOpenApiData = useCallback(async (stageId: string) => {
    // 다른 stage 선택 시 이전 선택 상태 초기화
    setSelectedResource(null);
    setSelectedTreeMethod(null);

    // 토글 로직: 이미 열려있으면 닫기, 아니면 해당 stage만 열기
    let isClosing = false;
    setExpandedStages((prev) => {
      if (prev.has(stageId)) {
        // 같은 stage 클릭 시 닫기
        setSelectedStageId(null);
        setStageDetailData(null);
        isClosing = true;
        return new Set();
      } else {
        // 다른 stage 클릭 시 이전 것 닫고 새로운 것만 열기
        setSelectedStageId(stageId);
        return new Set([stageId]);
      }
    });

    if (isClosing) return;

    // 스테이지 상세 정보 조회
    const detailRes = await getStageDetailData(stageId);
    if (detailRes) {
      setStageDetailData(detailRes);
    }

    // 이미 캐시된 데이터가 있으면 리소스 트리 API 호출 스킵
    if (stageResourcesMap[stageId]) {
      return;
    }

    // OpenAPI 데이터 조회 및 변환
    const res = await getStagesOpenApiDocData(stageId);
    if (res?.paths) {
      const tree = resoureceBuildTree(res.paths);
      setStageResourcesMap((prev) => ({
        ...prev,
        [stageId]: tree,
      }));
    }
  }, [stageResourcesMap]);

  // 첫 번째 stage 자동 선택
  useEffect(() => {
    if (
      !initializedRef.current &&
      stagesListData &&
      stagesListData.length > 0
    ) {
      initializedRef.current = true;
      const firstStage = stagesListData[0];
      handleStageOpenApiData(firstStage.stageId);
    }
  }, [stagesListData, handleStageOpenApiData]);

  // 삭제 후 마지막 스테이지 선택
  useEffect(() => {
    if (pendingDeleteSelectionRef.current && stagesListData) {
      pendingDeleteSelectionRef.current = false;
      if (stagesListData.length > 0) {
        const lastStage = stagesListData[stagesListData.length - 1];
        handleStageOpenApiData(lastStage.stageId);
      } else {
        // 스테이지가 없으면 상태 초기화
        setSelectedStageId(null);
        setStageDetailData(null);
        setSelectedResource(null);
        setSelectedTreeMethod(null);
        setExpandedStages(new Set());
      }
    }
  }, [stagesListData, handleStageOpenApiData]);

  // 스테이지 삭제 후 처리
  const handleAfterStageDelete = useCallback(() => {
    // 현재 선택 상태 초기화
    setSelectedStageId(null);
    setStageDetailData(null);
    setSelectedResource(null);
    setSelectedTreeMethod(null);
    setExpandedStages(new Set());
    // 마지막 스테이지 선택을 위한 플래그 설정
    pendingDeleteSelectionRef.current = true;
  }, []);

  // 생성 후 마지막 스테이지 선택 (새로 생성된 스테이지가 마지막에 위치)
  useEffect(() => {
    if (pendingCreateSelectionRef.current && stagesListData && stagesListData.length > 0) {
      pendingCreateSelectionRef.current = false;
      const lastStage = stagesListData[stagesListData.length - 1];
      handleStageOpenApiData(lastStage.stageId);
    }
  }, [stagesListData, handleStageOpenApiData]);

  // 스테이지 생성 후 처리
  const handleAfterStageCreate = useCallback(() => {
    // 현재 선택 상태 초기화
    setSelectedStageId(null);
    setStageDetailData(null);
    setSelectedResource(null);
    setSelectedTreeMethod(null);
    setExpandedStages(new Set());
    // 마지막 스테이지 선택을 위한 플래그 설정
    pendingCreateSelectionRef.current = true;
  }, []);

  const handleToggleResourceExpansion = useCallback((resourceId: string) => {
    setExpandedResources((prev) => {
      if (prev.includes(resourceId)) {
        return prev.filter((id) => id !== resourceId);
      }
      return [...prev, resourceId];
    });
  }, []);

  const handleTreeResourceClick = useCallback((resource: any) => {
    setSelectedResource(resource);
    setSelectedTreeMethod(null);
  }, []);

  const handleTreeMethodClick = useCallback((method: any, resource: any) => {
    setSelectedTreeMethod(method);
    setSelectedResource(resource);
  }, []);

  const handleExportApi = useCallback(() => {
    toast.success("API export started.");
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

  const handleOpenExportModal = useCallback(() => {
    setIsExportModalOpen(true);
  }, []);

  const handleCloseExportModal = useCallback(() => {
    setIsExportModalOpen(false);
  }, []);

  // stageDetailData 갱신 함수
  const refreshStageDetailData = useCallback(async () => {
    if (selectedStageId) {
      const detailRes = await getStageDetailData(selectedStageId);
      if (detailRes) {
        setStageDetailData(detailRes);
      }
    }
  }, [selectedStageId]);

  return {
    // Data
    userKey,
    tenantId,
    apiId,
    stagesListData,
    selectedWholeStageInfo,
    selectedMethod,
    expandedPaths,
    selectedStageEndpointUrl,

    // Modal states
    isEditModalOpen,
    isCreateStageModalOpen,
    isDeleteStageDialogOpen,
    isExportModalOpen,

    // Stage Resource Tree 관련 상태
    selectedStageId,
    stageResourcesMap,
    expandedStages,
    expandedResources,
    selectedResource,
    selectedTreeMethod,
    stageDetailData,
    refreshStageDetailData,
    onAfterStageDelete: handleAfterStageDelete,
    onAfterStageCreate: handleAfterStageCreate,

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
    onOpenExportModal: handleOpenExportModal,
    onCloseExportModal: handleCloseExportModal,
    onStageOpenApiData: handleStageOpenApiData,
    onToggleResourceExpansion: handleToggleResourceExpansion,
    onTreeResourceClick: handleTreeResourceClick,
    onTreeMethodClick: handleTreeMethodClick,
    getResourceKey,
  };
}
