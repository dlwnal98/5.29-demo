// 대쉬보드 데이터 /admin/summary
export const eurekaDashboardData = {
  totalServices: 7,
  totalInstances: 22,
  statusCount: {
    UP: 19,
    DOWN: 2,
    OUT_OF_SERVICE: 1,
  },
  zoneCount: {
    "kr-a": 12,
    "kr-b": 10,
  },
  selfPreservation: true,
  recentInstances: [
    {
      serviceName: "AUTH-SERVER",
      instanceId: "auth-server:8081",
      status: "UP",
      lastUpdated: 1718087200000,
    },
  ],
};

// 서비스 목록 데이터 /admin/services

export const eurekaServicesData = [
  {
    serviceName: "AUTH-SERVER",
    instanceCount: 2,
    statusSummary: {
      UP: 1,
      DOWN: 1,
    },
    zones: ["kr-a", "kr-b"],
    versions: ["1.0.0", "1.0.1"],
    instances: [
      {
        instanceId: "auth-server:8081",
        ip: "10.0.1.12",
        port: 8081,
        isPortEnabled: true,
        status: "UP",
        zone: "kr-a",
        gitCommit: "abc123def",
        lastUpdatedTimestamp: 1718087200000,
      },
      {
        instanceId: "auth-server:8082",
        ip: "10.0.1.13",
        port: 8082,
        isPortEnabled: true,
        status: "UP",
        zone: "kr-b",
        gitCommit: "abc123defg",
        lastUpdatedTimestamp: 17180872000001,
      },
    ],
  },
  {
    serviceName: "Auth 서버2",
    instanceCount: 4,
    statusSummary: {
      UP: 2,
      DOWN: 2,
    },
    zones: ["kr-c", "kr-d", "kr-e", "kr-f"],
    versions: ["2.0.0", "2.0.1", "2.0.2", "2.0.3"],
    instances: [
      {
        instanceId: "auth-server:2231",
        ip: "20.0.1.12",
        port: 8083,
        isPortEnabled: true,
        status: "UP",
        zone: "kr-c",
        gitCommit: "abc123def",
        lastUpdatedTimestamp: 1718087200000,
      },
      {
        instanceId: "auth-server:8083",
        ip: "20.0.1.13",
        port: 8084,
        isPortEnabled: false,
        status: "UP",
        zone: "kr-d",
        gitCommit: "abc123defgh",
        lastUpdatedTimestamp: 17180872000001,
      },
      {
        instanceId: "auth-server:2fds",
        ip: "20.0.1.14",
        port: 8085,
        isPortEnabled: false,
        status: "DOWN",
        zone: "kr-e",
        gitCommit: "abc123def",
        lastUpdatedTimestamp: 1718087200003,
      },
      {
        instanceId: "auth-server:8086",
        ip: "20.0.1.15",
        port: 8086,
        isPortEnabled: true,
        status: "DOWN",
        zone: "kr-f",
        gitCommit: "abc123defghi",
        lastUpdatedTimestamp: 17180872000004,
      },
    ],
  },
];

// 인스턴스 상세 데이터 /admin/instances/{instanceId}

export const instanceData = {
  instanceId: "user-service:8081",
  hostName: "localhost",
  app: "USER-SERVICE",
  ipAddr: "172.18.0.6",
  status: "UP",
  overriddenStatus: "UNKNOWN",
  port: 8081,
  isPortEnabled: true,
  securePort: 443,
  isSecurePortEnabled: false,
  dataCenter: "MyOwn",
  leaseInfo: {
    renewalIntervalInSecs: 30,
    durationInSecs: 90,
    registrationTimestamp: 1749581820000,
    lastRenewalTimestamp: 1749582882000,
    evictionTimestamp: 0,
    serviceUpTimestamp: 1749581830000,
  },
  metadata: {
    version: "1.5.2",
    gitCommit: "e6b3c2d",
    managementPort: "8081",
    team: "user-team",
  },
  homePageUrl: "http://localhost:8081/",
  statusPageUrl: "http://localhost:8081/actuator/info",
  healthCheckUrl: "http://localhost:8081/actuator/health",
  vipAddress: "user-service",
  secureVipAddress: "user-service",
  isCoordinatingDiscoveryServer: false,
  lastUpdatedTimestamp: 1749582882000,
  lastDirtyTimestamp: 1749581830000,
  actionType: "ADDED",
};
