import { SquareMinus, SquarePlus, Eye } from 'lucide-react';
import { getMethodStyle } from '@/lib/etc';
import type { Resource, Method } from '@/types/resource';

interface Props {
  resources: Resource[];
  expandedResources: string[];
  selectedResourceId: string | null;
  selectedMethodId: string | null;
  onResourceClick: (id: string) => void;
  onMethodClick: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

export default function ResourceTree({
  resources,
  expandedResources,
  selectedResourceId,
  selectedMethodId,
  onResourceClick,
  onMethodClick,
  onToggleExpand,
}: Props) {
  const renderTree = (list: Resource[]) => {
    return (
      <div className="space-y-1">
        {list.map((res) => {
          const isExpanded = expandedResources.includes(res.id);
          const isSelected = selectedResourceId === res.id;

          return (
            <div key={res.id}>
              <div
                className={`flex items-center gap-2 py-1 px-2 mb-1 cursor-pointer rounded ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : ''
                }`}
                onClick={() => onResourceClick(res.id)}>
                {(res.children?.length ?? 0) > 0 || (res.methods?.length ?? 0) > 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(res.id);
                    }}>
                    {isExpanded ? (
                      <SquareMinus className="h-3 w-3" />
                    ) : (
                      <SquarePlus className="h-3 w-3" />
                    )}
                  </button>
                ) : (
                  <div className="w-2" />
                )}
                <span className="font-medium text-sm">
                  {res.name === '/' ? '/' : `/${res.name}`}
                </span>
              </div>

              {/* methods */}
              {isExpanded && res.methods?.length > 0 && (
                <div className="ml-6 space-y-1">
                  {res.methods.map((m: Method) => {
                    const isMethodSelected = selectedMethodId === m.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-2 py-1 px-2 cursor-pointer ${
                          isMethodSelected
                            ? 'bg-white dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                        onClick={() => onMethodClick(m.id)}>
                        <span
                          className={`${getMethodStyle(m.type)} !font-mono !font-medium !text-xs !px-1.5 !py-0.5 rounded`}>
                          {m.type}
                        </span>
                        {isMethodSelected && <Eye className="w-3 h-3" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* children */}
              {isExpanded && res.children?.length > 0 && (
                <div className="ml-4">{renderTree(res.children)}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return <>{renderTree(resources)}</>;
}
