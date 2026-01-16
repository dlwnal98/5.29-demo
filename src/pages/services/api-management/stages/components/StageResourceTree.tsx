import { SquarePlus, SquareMinus, Eye } from "lucide-react";
import { getMethodStyle } from "@/libs/etc";

interface StageResourceTreeProps {
  stagesListData: any;
  stageResourcesMap: Record<string, any[]>;
  expandedStages: Set<string>;
  expandedResources: string[];
  selectedResource: any | null;
  selectedTreeMethod: any | null;
  onStageOpenApiData: (stageId: string) => void;
  onToggleResourceExpansion: (resourceId: string) => void;
  onTreeResourceClick: (resource: any) => void;
  onTreeMethodClick: (method: any, resource: any) => void;
}

/**
 * Stage Resource Tree를 렌더링하는 컴포넌트
 * - Stage 목록을 보여주고 클릭 시 해당 stage의 리소스 트리를 펼침
 * - ResourcesPageView의 renderResourceTree 로직을 재사용
 */
export function StageResourceTree({
  stagesListData,
  stageResourcesMap,
  expandedStages,
  expandedResources,
  selectedResource,
  selectedTreeMethod,
  onStageOpenApiData,
  onToggleResourceExpansion,
  onTreeResourceClick,
  onTreeMethodClick,
}: StageResourceTreeProps) {

  // 리소스 트리를 재귀적으로 렌더링하는 함수
  // stageId를 prefix로 붙여서 각 스테이지별로 고유한 ID 생성
  const renderResourceTree = (list: any[], stageId: string, depth: number = 0) => {
    return (
      <div className="space-y-1">
        {list.map((res: any) => {
          // stageId를 prefix로 붙여서 고유한 ID 생성
          const uniqueId = `${stageId}-${res.id}`;
          const isExpanded = expandedResources?.includes(uniqueId);
          const isSelected = selectedResource?.uniqueId === uniqueId;
          const hasChildren = (res.children?.length ?? 0) > 0 || (res.methods?.length ?? 0) > 0;

          return (
            <div key={uniqueId}>
              <div
                className={`flex items-center gap-2 py-1 px-2 mb-1 cursor-pointer rounded ${isSelected
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={() => onTreeResourceClick({ ...res, uniqueId, stageId })}
              >
                {hasChildren ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleResourceExpansion(uniqueId);
                    }}
                  >
                    {isExpanded ? (
                      <SquareMinus className="h-3 w-3" />
                    ) : (
                      <SquarePlus className="h-3 w-3" />
                    )}
                  </button>
                ) : (
                  <div className="w-3" />
                )}
                <span className="font-medium text-sm">
                  {res.name === "/" ? "/" : `/${res.name}`}
                </span>
              </div>

              {/* methods */}
              {isExpanded && res.methods?.length > 0 && (
                <div className="space-y-1" style={{ paddingLeft: `${depth * 12 + 24}px` }}>
                  {res.methods.map((m: any) => {
                    const methodUniqueId = `${stageId}-${m.id}`;
                    const isMethodSelected = selectedTreeMethod?.uniqueId === methodUniqueId;
                    return (
                      <div
                        key={methodUniqueId}
                        className={`flex items-center gap-2 py-1 px-2 cursor-pointer rounded `}
                        onClick={() => onTreeMethodClick({ ...m, uniqueId: methodUniqueId, stageId }, { ...res, uniqueId, stageId })}
                      >
                        <span
                          className={`${getMethodStyle(m.type)} !font-mono !font-bold !text-xs !px-1.5 !py-0.5 rounded`}
                          title={m.info?.summary}
                        >
                          {m.type}
                        </span>
                        {isMethodSelected && <Eye className="w-3 h-3" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* children recursive */}
              {isExpanded && res.children?.length > 0 && (
                <div>{renderResourceTree(res.children, stageId, depth + 1)}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {stagesListData?.map((stage: any) => {
        const isStageExpanded = expandedStages.has(stage.stageId);
        const stageResources = stageResourcesMap[stage.stageId] || [];
        return (
          <div key={stage.stageId}>
            {/* Stage 버튼 */}
            <div
              className={`flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-sm ${isStageExpanded ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              onClick={() => onStageOpenApiData(stage.stageId)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStageOpenApiData(stage.stageId);
                }}
              >
                {isStageExpanded ? (
                  <SquareMinus className="h-4 w-4 text-blue-600" />
                ) : (
                  <SquarePlus className="h-4 w-4" />
                )}
              </button>
              <span className={`font-medium ${isStageExpanded ? "text-blue-600" : ""}`}>
                {stage.stageName}
              </span>
            </div>

            {/* Stage 하위 리소스 트리 */}
            {isStageExpanded && stageResources.length > 0 && (
              <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-2">
                {renderResourceTree(stageResources, stage.stageId)}
              </div>
            )}

            {/* 로딩 또는 빈 상태 */}
            {isStageExpanded && stageResources.length === 0 && (
              <div className="ml-6 py-2 text-sm text-gray-500 dark:text-gray-400">
                리소스를 불러오는 중...
              </div>
            )}
          </div>
        );
      })}

      {/* 스테이지가 없을 때 */}
      {(!stagesListData || stagesListData.length === 0) && (
        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          생성된 스테이지가 없습니다.
        </div>
      )}
    </div>
  );
}
