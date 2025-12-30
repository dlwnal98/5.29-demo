import { Toaster } from "sonner";
import { SquarePlus, SquareMinus, Eye } from "lucide-react";
import { getMethodStyle } from "@/lib/etc";
import type { ApiResource, ApiMethod, SelectedWholeStageInfo, SelectedMethod } from "../types";

interface StageResourceTreeProps {
  resource: ApiResource;
  level?: number;
  parentPath?: string;
  selectedWholeStageInfo: SelectedWholeStageInfo;
  selectedMethod: SelectedMethod | null;
  expandedPaths: Set<string>;
  onResourceClick: (resource: ApiResource, type: "stage" | "resource") => void;
  onMethodClick: (method: ApiMethod, resource: ApiResource) => void;
  onToggleExpanded: (resource: ApiResource, parentPath?: string) => void;
  getResourceKey: (resource: ApiResource, parentPath?: string) => string;
}

/**
 * Stage Resource Tree를 재귀적으로 렌더링하는 컴포넌트
 */
export function StageResourceTree({
  resource,
  level = 0,
  parentPath = "",
  selectedWholeStageInfo,
  selectedMethod,
  expandedPaths,
  onResourceClick,
  onMethodClick,
  onToggleExpanded,
  getResourceKey,
}: StageResourceTreeProps) {
  const resourceKey = getResourceKey(resource, parentPath);
  const isExpanded = expandedPaths.has(resourceKey);
  const hasChildren =
    (resource.children && resource.children.length > 0) ||
    (resource.methods && resource.methods.length > 0);
  const isStage = level === 0;

  return (
    <div key={resource.id}>
      <div
        className={`flex items-center gap-2 py-1 mb-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-sm ${selectedWholeStageInfo?.resource?.id === resource.id
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            : ""
          }`}
        style={{ paddingLeft: `${level * 8 + 8}px` }}
        onClick={() =>
          onResourceClick(resource, isStage ? "stage" : "resource")
        }
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded(resource, parentPath);
            }}
          >
            {isExpanded ? (
              <SquareMinus className="h-3 w-3" />
            ) : (
              <SquarePlus className="h-3 w-3" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-3" />}

        <span
          className={`font-medium text-sm ${selectedWholeStageInfo.resource?.id !== resource.id
              ? ""
              : "text-blue-700 dark:text-gray-300"
            }`}
        >
          {isStage
            ? resource.name
            : resource.name === "/"
              ? "/"
              : `/${resource.name}`}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {resource.methods?.map((method, index) => (
            <div
              key={`${resource.id}-${method.id}-${index}`}
              className={`flex items-center justify-between gap-2 h-[32px] py-1 px-2 text-xs cursor-pointer dark:hover:bg-green-900/20 rounded ${selectedMethod?.method.id === method.id
                  ? "bg-white dark:bg-green-900/30 text-gray-700 dark:text-green-300"
                  : "text-gray-600 dark:text-gray-400"
                }`}
              onClick={() => onMethodClick(method, resource)}
            >
              <div
                className="space-x-1"
                style={{ paddingLeft: `${level * 8 + 13}px` }}
              >
                <span
                  className={`${getMethodStyle(method.type)} !font-mono !font-bold !text-xs !px-1.5 !py-0.5 rounded`}
                  title={method.info?.summary}
                >
                  {method.type}
                </span>
              </div>
              {selectedMethod?.method.id === method.id && (
                <Eye className="w-4 h-4" />
              )}
            </div>
          ))}

          {resource.children?.map((child) => (
            <StageResourceTree
              key={child.id}
              resource={child}
              level={level + 1}
              parentPath={resourceKey}
              selectedWholeStageInfo={selectedWholeStageInfo}
              selectedMethod={selectedMethod}
              expandedPaths={expandedPaths}
              onResourceClick={onResourceClick}
              onMethodClick={onMethodClick}
              onToggleExpanded={onToggleExpanded}
              getResourceKey={getResourceKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}
