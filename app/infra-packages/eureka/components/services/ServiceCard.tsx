import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";

interface Instance {
  instanceId: string;
  ip: string;
  port: number;
  isPortEnabled: boolean;
  status: string;
  zone: string;
  gitCommit: string;
  lastUpdatedTimestamp: number;
}

interface ServiceCardProps {
  serviceName: string;
  instanceCount: number;
  statusSummary: {
    UP: number;
    DOWN: number;
  };
  zones: string[];
  versions: string[];
  instances: Instance[];
}

export function ServiceCard({
  serviceName,
  instanceCount,
  statusSummary,
  zones,
  versions,
  instances,
}: ServiceCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{serviceName}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {instanceCount} 인스턴스
            </Badge>
            <Badge variant="outline" className="text-xs">
              {zones.length} 가용존
            </Badge>
            <Badge variant="outline" className="text-xs">
              {versions.length} 버전
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="UP" />
          <span className="text-sm text-gray-500">({statusSummary.UP})</span>
          <StatusBadge status="DOWN" />
          <span className="text-sm text-gray-500">({statusSummary.DOWN})</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {instances.map((instance) => (
            <div
              key={instance.instanceId}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {instance.instanceId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {instance.ip}:{instance.port}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {instance.zone}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end text-right space-y-1">
                <StatusBadge status={instance.status} />
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {instance.zone}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
