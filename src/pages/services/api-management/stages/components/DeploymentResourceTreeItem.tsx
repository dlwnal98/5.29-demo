import { memo } from 'react';
import { getMethodStyle } from '@/libs/etc';

interface DeploymentResourceTreeItemProps {
  resource: any;
  level?: number;
}

/**
 * 배포 리소스 트리의 개별 아이템을 렌더링하는 컴포넌트
 * React.memo를 적용하여 불필요한 리렌더링 방지
 */
export const DeploymentResourceTreeItem = memo(function DeploymentResourceTreeItem({
  resource,
  level = 0
}: DeploymentResourceTreeItemProps) {
  if (!resource) return null;

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2 py-1 text-sm">
        <span className="text-gray-900">{resource.path}</span>
      </div>
      {resource.methods && resource.methods.length > 0 && (
        <div className="ml-4 space-y-1">
          {resource.methods.map((method: any) => (
            <div key={method.id} className="flex items-center gap-2 py-1">
              <span
                className={`${getMethodStyle(method.type)} !font-mono !font-bold !text-xs !px-1.5 !py-0.5 rounded`}>
                {method.type}
              </span>
              {method.info?.description && (
                <span className="text-sm text-gray-600">- {method.info.description}</span>
              )}
            </div>
          ))}
        </div>
      )}
      {resource.children?.map((child: any) => (
        <DeploymentResourceTreeItem key={child.id} resource={child} level={level + 1} />
      ))}
    </div>
  );
});
