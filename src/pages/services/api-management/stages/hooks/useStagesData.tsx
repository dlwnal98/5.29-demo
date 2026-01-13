import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetStagesDocData } from "@/hooks/use-stages";
import { buildTree } from "@/libs/etc";
import { requestGet } from "@/libs/apiClient";
import type { ApiResource } from "../types";

/**
 * 서버 통신 및 데이터 처리 로직을 담당하는 hook
 */
export function useStagesData(stageId: string) {
  const { data: stagesDocData = [] } = useGetStagesDocData(stageId);

  const [selectedStageEndpointUrl, setSelectedStageEndpointUrl] = useState("");

  // Resource tree 빌드
  const resourceTree = useMemo(() => buildTree(stagesDocData) as unknown as ApiResource[], [stagesDocData]);

  // Stage의 endpoint URL 가져오기
  const getFinalEndpoint = useCallback(async (stageId: string) => {
    if (!stageId) return;
    const res = await requestGet(`/api/v1/gateway/stage/${stageId}`);
    setSelectedStageEndpointUrl(res.data.baseUrl);
  }, []);

  return {
    resourceTree,
    selectedStageEndpointUrl,
    getFinalEndpoint,
  };
}
