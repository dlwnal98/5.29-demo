import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useClipboard } from "use-clipboard-copy";
import { useAuthStore } from "@/stores/store";
import { resoureceBuildTree } from "@/libs/etc";
import { requestGet } from "@/libs/request";
import { useGetStagesListData, useGetDeployHistoryDataByApiId } from "@/hooks/use-stages";
import { getStagesOpenApiDocData, getStageDetailData } from "@/apis/stages.api";
import { getAPIKeyDetail } from "@/apis/api-keys.api";

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
  const urlStageId = searchParams.get("stageId") || "";
  const clipboard = useClipboard();

  const { data: stagesListData } = useGetStagesListData(apiId);

  // 배포 히스토리 페이지네이션 상태
  const [deploymentPage, setDeploymentPage] = useState(0);
  const [deploymentSize, setDeploymentSize] = useState(20);

  const { data: deploymentHistoryData, refetch: refetchDeploymentHistory } = useGetDeployHistoryDataByApiId(
    apiId,
    deploymentPage,
    deploymentSize
  );

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
  // const [apiKeyValue, setApiKeyValue] = useState<string>("");


  const handleGetApiKeyValue = async (apiKeyId: string) => {
    const res = await getAPIKeyDetail(apiKeyId);
    return res.keyValue;
  };

  const getFinalEndpoint = useCallback(async (stageId: string) => {
    if (!stageId) return;
    const res = await requestGet(`/api/v1/gateway/stage/${stageId}`);
    setSelectedStageEndpointUrl(res.data.baseUrl);
  }, []);

  const initializedRef = useRef(false);
  const pendingDeleteSelectionRef = useRef(false);
  const pendingCreateSelectionRef = useRef(false);
  const prevUrlStageIdRef = useRef<string | null>(null);

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
      toast.success("Method URL이 클립보드에 복사되었습니다.");
    },
    [clipboard]
  );

  // 스테이지 토글 (펼침/접힘만 제어) - 토글 버튼 클릭 시 사용
  const handleToggleStageExpansion = useCallback((stageId: string) => {
    setExpandedStages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  }, []);

  // 스테이지 선택 (상세정보 표시 + 펼침) - 스테이지 이름 클릭 시 사용
  const handleStageOpenApiData = useCallback(async (stageId: string) => {
    // 리소스/메서드 선택 해제
    setSelectedResource(null);
    setSelectedTreeMethod(null);

    // 선택된 스테이지 설정
    setSelectedStageId(stageId);

    // 아직 펼쳐지지 않은 경우에만 펼침 (기존 펼쳐진 스테이지 유지)
    if (!expandedStages.has(stageId)) {
      setExpandedStages(prev => new Set([...prev, stageId]));
    }

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
  }, [stageResourcesMap, expandedStages]);

  // 첫 번째 stage 자동 선택 또는 URL에서 지정된 stageId 선택
  useEffect(() => {
    if (
      !initializedRef.current &&
      stagesListData &&
      stagesListData.length > 0
    ) {
      initializedRef.current = true;

      // URL에 stageId가 있으면 해당 스테이지 선택, 없으면 첫 번째 스테이지 선택
      if (urlStageId) {
        const targetStage = stagesListData.find((stage: any) => stage.stageId === urlStageId);
        if (targetStage) {
          handleStageOpenApiData(targetStage.stageId);
        } else {
          // URL의 stageId가 존재하지 않으면 첫 번째 스테이지 선택
          const firstStage = stagesListData[0];
          handleStageOpenApiData(firstStage.stageId);
        }
      } else {
        const firstStage = stagesListData[0];
        handleStageOpenApiData(firstStage.stageId);
      }
    }
  }, [stagesListData, handleStageOpenApiData, urlStageId]);

  // URL stageId 변경 감지 (다른 페이지에서 스테이지 페이지로 이동 시)
  useEffect(() => {
    // 초기화가 완료된 후에만 URL 변경을 감지
    if (!initializedRef.current) {
      prevUrlStageIdRef.current = urlStageId;
      return;
    }

    // URL stageId가 변경되었고, 유효한 값인 경우
    if (urlStageId && urlStageId !== prevUrlStageIdRef.current && stagesListData) {
      const targetStage = stagesListData.find((stage: any) => stage.stageId === urlStageId);
      if (targetStage) {
        // 현재 선택된 스테이지와 다른 경우에만 선택
        if (selectedStageId !== urlStageId) {
          handleStageOpenApiData(urlStageId);
        }
      }
    }
    prevUrlStageIdRef.current = urlStageId;
  }, [urlStageId, stagesListData, selectedStageId, handleStageOpenApiData]);

  // 삭제 후 첫 번째 스테이지 선택
  useEffect(() => {
    if (pendingDeleteSelectionRef.current && stagesListData) {
      pendingDeleteSelectionRef.current = false;
      if (stagesListData.length > 0) {
        const firstStage = stagesListData[0];
        handleStageOpenApiData(firstStage.stageId);
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

  // 생성 후 마지막 스테이지 선택 (stageId가 없는 경우 fallback)
  useEffect(() => {
    if (pendingCreateSelectionRef.current && stagesListData && stagesListData.length > 0) {
      pendingCreateSelectionRef.current = false;
      const lastStage = stagesListData[stagesListData.length - 1];
      handleStageOpenApiData(lastStage.stageId);
    }
  }, [stagesListData, handleStageOpenApiData]);

  // 스테이지 생성 후 처리
  const handleAfterStageCreate = useCallback((stageId?: string) => {
    // 현재 선택 상태 초기화
    setSelectedResource(null);
    setSelectedTreeMethod(null);
    setExpandedStages(new Set());

    // stageId가 있으면 직접 해당 스테이지 선택
    if (stageId) {
      handleStageOpenApiData(stageId);
      refetchDeploymentHistory();
      return;
    }

    // stageId가 없는 경우 fallback: ref 기반 방식
    setSelectedStageId(null);
    setStageDetailData(null);
    pendingCreateSelectionRef.current = true;
    refetchDeploymentHistory();
  }, [handleStageOpenApiData, refetchDeploymentHistory]);

  const handleToggleResourceExpansion = useCallback((resourceId: string) => {
    setExpandedResources((prev) => {
      if (prev.includes(resourceId)) {
        return prev.filter((id) => id !== resourceId);
      }
      return [...prev, resourceId];
    });
  }, []);

  const handleTreeResourceClick = useCallback(async (resource: any) => {
    setSelectedResource(resource);
    setSelectedTreeMethod(null);

    // 스테이지가 변경된 경우에만 stageDetailData 업데이트
    if (resource?.stageId && resource.stageId !== selectedStageId) {
      setSelectedStageId(resource.stageId);
      const detailRes = await getStageDetailData(resource.stageId);
      if (detailRes) {
        setStageDetailData(detailRes);
      }
    }
  }, [selectedStageId]);

  // 리소스 트리에서 특정 리소스까지의 경로를 찾는 함수
  const findResourcePath = useCallback((
    tree: any[],
    targetId: string,
    stageId: string,
    currentPath: string[] = []
  ): string[] | null => {
    for (const node of tree) {
      const uniqueId = `${stageId}-${node.id}`;
      const newPath = [...currentPath, uniqueId];

      if (node.id === targetId) {
        return newPath;
      }

      if (node.children?.length > 0) {
        const foundPath = findResourcePath(node.children, targetId, stageId, newPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
    return null;
  }, []);

  const handleTreeMethodClick = useCallback(async (method: any, resource: any) => {
    setSelectedTreeMethod(method);
    setSelectedResource(resource);

    // 스테이지가 변경된 경우에만 stageDetailData 업데이트
    if (method?.stageId && method.stageId !== selectedStageId) {
      setSelectedStageId(method.stageId);
      const detailRes = await getStageDetailData(method.stageId);
      if (detailRes) {
        setStageDetailData(detailRes);
      }
    }

    // 해당 리소스까지의 경로를 찾아서 모두 펼치기
    if (resource?.stageId && resource?.id) {
      const resourceTree = stageResourcesMap[resource.stageId] || [];
      const pathToResource = findResourcePath(resourceTree, resource.id, resource.stageId);

      if (pathToResource && pathToResource.length > 0) {
        setExpandedResources((prev) => {
          const newExpanded = new Set(prev);
          pathToResource.forEach((id) => newExpanded.add(id));
          return Array.from(newExpanded);
        });
      }
    }
  }, [selectedStageId, stageResourcesMap, findResourcePath]);

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
    deploymentHistoryData,
    refetchDeploymentHistory,
    deploymentPage,
    setDeploymentPage,
    deploymentSize,
    setDeploymentSize,
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
    onGetApiKeyValue: handleGetApiKeyValue,
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
    onToggleStageExpansion: handleToggleStageExpansion,
    onToggleResourceExpansion: handleToggleResourceExpansion,
    onTreeResourceClick: handleTreeResourceClick,
    onTreeMethodClick: handleTreeMethodClick,
    getResourceKey,
  };
}
