import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { EurekaServices, ServicesInstance } from "@/types/eureka";

interface ServiceCardViewProps {
  servicesData: EurekaServices[];
  onInstanceClick: (instance: ServicesInstance) => void;
}

function getStatusIcon(status: string) {
  switch (status) {
    case "UP":
      return <CheckCircle className="w-4 h-4" />;
    case "DOWN":
      return <XCircle className="w-4 h-4" />;
    case "OUT_OF_SERVICE":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={status === "UP" ? "default" : status === "DOWN" ? "destructive" : "secondary"}
      className="flex items-center gap-1"
    >
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
}

export default function ServiceCardView({
  servicesData,
  onInstanceClick,
}: ServiceCardViewProps) {
  return (
    <>
      {servicesData?.map((service: EurekaServices) => (
        <Card key={service.serviceName} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">{service.serviceName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>인스턴스 목록</span>
              <Badge variant="secondary" className="text-[13px]">
                {service.instances.length}개
              </Badge>
            </div>
            <div className="space-y-2 max-h-[150px] overflow-y-auto scrollbar-hide">
              {service.instances.map((instance) => {
                const zoneIndex = service.zones.indexOf(instance.zone);
                const matchedVersion = service.versions[zoneIndex] || "unknown";
                return (
                  <div
                    key={instance.instanceId}
                    className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => onInstanceClick(instance)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          instance.status === "UP" ? "bg-green-500" : "bg-red-500"
                        } animate-pulse`}
                      />
                      <div>
                        <div className="text-sm font-medium">{instance.instanceId}</div>
                        <div className="text-xs text-gray-500">
                          {instance.ip}:{instance.port} • v
                          {matchedVersion === "unknown"
                            ? instance.lastUpdatedTimestamp
                            : matchedVersion}
                        </div>
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
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
