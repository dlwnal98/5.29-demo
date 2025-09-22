'use client';

import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Server,
  Activity,
  Globe,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Network,
  Database,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEurekaInstances } from '@/hooks/useEurekaData';
import { ServicesInstance, EurekaServices } from '@/types/eureka';

interface ModalProps {
  selectedInstance: ServicesInstance;
  onOpenChange: (open: boolean) => void;
  eurekaServicesData: EurekaServices[];
}

export default function InstanceDetailModal({
  selectedInstance,
  onOpenChange,
  eurekaServicesData,
}: ModalProps) {
  const { data: instanceData } = useEurekaInstances(selectedInstance?.instanceId);

  const modalContentRef = useRef<HTMLDivElement>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UP':
        return <CheckCircle className="w-4 h-4" />;
      case 'DOWN':
        return <XCircle className="w-4 h-4" />;
      case 'OUT_OF_SERVICE':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <Badge
      variant={status === 'UP' ? 'default' : status === 'DOWN' ? 'destructive' : 'secondary'}
      className="flex items-center gap-1">
      {getStatusIcon(status)}
      {status}
    </Badge>
  );

  // 인스턴스 변경 시 스크롤을 최상위로 이동하는 함수
  const handleInstanceChange = (instance: any) => {
    onOpenChange(instance);

    //instanceId 로 api 호출해서 해당 인스턴스 데이터 불러와서 뿌려줘야함
    // 다음 렌더링 후 스크롤 이동
    setTimeout(() => {
      if (modalContentRef.current) {
        modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    instanceData && (
      <Dialog open={!!selectedInstance} onOpenChange={() => onOpenChange(false)}>
        <DialogContent
          ref={modalContentRef}
          className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>{instanceData.appName || '서비스'} - 인스턴스 상세 정보</span>
              {selectedInstance && (
                <Badge variant="outline" className="ml-2">
                  {instanceData.instanceId}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedInstance && (
            <div className="space-y-6">
              {/* Status Info */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">상태 정보</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">현재 상태</span>
                    <StatusBadge status={instanceData.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">덮어쓴 상태</span>
                    <Badge variant="secondary">{instanceData.overriddenStatus}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">마지막 이벤트</span>
                    <Badge variant="outline">{instanceData.actionType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      코디네이터 역할
                    </span>
                    <Badge
                      variant={
                        instanceData.isCoordinatingDiscoveryServer ? 'default' : 'secondary'
                      }>
                      {instanceData.isCoordinatingDiscoveryServer ? '예' : '아니오'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">최근 갱신</span>
                    <span className="text-sm font-medium">
                      {new Date(instanceData.lastUpdatedTimestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">마지막 Dirty</span>
                    <span className="text-sm font-medium">
                      {new Date(instanceData.lastDirtyTimestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Network Info */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Network className="w-4 h-4 text-green-500" />
                  <span className="font-medium">네트워크 정보</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">IP 주소</span>
                    <span className="text-sm font-medium">{instanceData.ipAddr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">호스트명</span>
                    <span className="text-sm font-medium">{instanceData.hostName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">HTTP 포트</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{instanceData.port}</span>
                      {instanceData.isPortEnabled ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">HTTPS 포트</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{instanceData.securePort}</span>
                      {instanceData.isSecurePortEnabled ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">데이터센터</span>
                    <span className="text-sm font-medium">{instanceData.dataCenter}</span>
                  </div>
                </div>
              </Card>

              {/* URLs */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">주요 진입 지점 URL</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      홈페이지 URL
                    </div>
                    <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {instanceData.homePageUrl}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      상태 페이지 URL
                    </div>
                    <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {instanceData.statusPageUrl}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      헬스체크 URL
                    </div>
                    <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {instanceData.healthCheckUrl}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">VIP 주소</div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {instanceData.vipAddress}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        보안 VIP 주소
                      </div>
                      <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {instanceData.secureVipAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              {/* Metadata */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">메타데이터</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(instanceData.metadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center bg-gray-0 dark:bg-gray-800/50 rounded">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
                      <span className="text-sm font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          {selectedInstance && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-4 h-4 text-blue-500" />
                <span className="font-medium">다른 인스턴스 목록</span>
              </div>
              <div className="flex flex-wrap gap-2 overflow-y-auto scrollbar-hide max-h-[50px]">
                {eurekaServicesData
                  .find((service) =>
                    service.instances.some(
                      (inst) => inst.instanceId === selectedInstance.instanceId
                    )
                  )
                  ?.instances.map((instance) => (
                    <Badge
                      key={instance.instanceId}
                      variant={
                        instance.instanceId === selectedInstance.instanceId ? 'default' : 'outline'
                      }
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        instance.instanceId === selectedInstance.instanceId
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-blue-50 dark:hover:bg-blue-900/30'
                      }`}
                      onClick={() => handleInstanceChange(instance)}>
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          instance.status === 'UP' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      {instance.instanceId.split('-').pop()}
                    </Badge>
                  ))}
              </div>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    )
  );
}
