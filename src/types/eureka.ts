import { LargeNumberLike } from "crypto";

export interface EurekaSummary {
  totalServices: number;
  totalInstances: number;
  statusCount: Record<string, number>;
  zoneCount: Record<string, number>;
  selfPreservation: boolean;
  recent: {
    serviceName: string;
    instanceId: string;
    status: string;
    lastUpdated: number | Date;
  }[];
}

export interface EurekaServices {
  serviceName: string;
  instanceCount: number;
  statusSummary: Record<string, number>;
  zones: string[];
  versions: string[];
  instances: {
    instanceId: string;
    ip: string;
    port: number;
    isPortEnabled: boolean;
    status: string;
    zone: string;
    gitCommit: string;
    lastUpdatedTimestamp: number | Date;
  }[];
}

export interface ServicesInstance {
  instanceId: string;
  ip: string;
  port: number;
  isPortEnabled: boolean;
  status: string;
  zone: string;
  gitCommit: string;
  lastUpdatedTimestamp: number | Date;
}

export interface EurekaInstance {
  instanceId: string;
  hostName: string;
  appName: string;
  ipAddr: string;
  status: string;
  overriddenStatus: string;
  port: number;
  isPortEnabled: boolean;
  securePort: number;
  isSecurePortEnabled: boolean;
  countryId: number;
  dataCenter: string;
  metadata: {
    [key: string]: string;
  };
  homePageUrl: string;
  statusPageUrl: string;
  healthCheckUrl: string;
  vipAddress: string;
  secureVipAddress: string;
  isCoordinatingDiscoveryServer: boolean;
  lastUpdatedTimestamp: number | Date;
  lastDirtyTimestamp: number | Date;
  actionType: string;
}
