import type { ReactNode } from 'react';
import { Activity, BarChart3, Server, Settings, Shield } from 'lucide-react';

export type AppStatus = 'running' | 'stopped' | 'error' | 'maintenance';

export interface DashboardApp {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
  url: string;
  status: AppStatus;
  version: string;
}
export const dashboardApps = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'API Management & Routing',
    icon: <Activity className="h-8 w-8" />,
    color: 'from-teal-500 to-blue-500',
    url: '/infra-packages/gateway',
    status: 'running',
    version: '4.0.7',
  },
  {
    id: 'eureka-server',
    name: 'Service Discovery',
    description: 'Eureka Server',
    icon: <Server className="h-8 w-8" />,
    color: 'from-green-500 to-emerald-500',
    url: '/infra-packages/eureka',
    status: 'running',
    version: '1.10.17',
  },
  {
    id: 'config-server',
    name: 'Configuration Manager',
    description: 'Config Server',
    icon: <Settings className="h-8 w-8" />,
    color: 'from-purple-500 to-indigo-500',
    url: '/infra-packages/config/projects?branch=main',
    status: 'running',
    version: '4.0.4',
  },
  {
    id: 'auth-server',
    name: 'Auth Server',
    description: 'Authentication & Authorization',
    icon: <Shield className="h-8 w-8" />,
    color: 'from-pink-500 to-rose-500',
    url: '/infra-packages/auth',
    status: 'running',
    version: '1.1.3',
  },
  {
    id: 'grafana',
    name: 'Monitoring',
    description: 'Grafana',
    icon: <BarChart3 className="h-8 w-8" />,
    color: 'from-orange-500 to-red-500',
    url: 'http://1.224.162.188:51308',
    status: 'running',
    version: '10.2.0',
  },
];

// 툴팁 설명 데이터
export const tooltipDescriptions = {
  cpu: 'CPU 사용량은 서버의 프로세서 사용률을 나타냅니다. 높은 값은 서버가 과부하 상태일 수 있음을 의미합니다.',
  memory:
    '메모리 사용량은 서버의 RAM 사용률을 나타냅니다. 높은 값은 메모리 부족으로 성능 저하가 발생할 수 있음을 의미합니다.',
  disk: '디스크 사용량은 서버의 저장 공간 사용률을 나타냅니다. 높은 값은 디스크 공간이 부족할 수 있음을 의미합니다.',
  network:
    '네트워크 트래픽은 서버의 네트워크 인터페이스를 통한 데이터 전송량을 나타냅니다. BPS는 초당 바이트, PPS는 초당 패킷을 의미합니다.',
  events:
    '이벤트는 서버에서 발생한 중요한 알림, 경고 및 오류를 표시합니다. 시스템 상태를 모니터링하는 데 중요합니다.',
};

// 이벤트 데이터
export const eventData = {
  basic: [
    {
      id: 1,
      status: 'warning',
      content: 'CPU 사용량 임계치 초과',
      startTime: '2025-06-05 15:23:45',
      endTime: '-',
      state: '진행중',
    },
    {
      id: 2,
      status: 'error',
      content: '디스크 공간 부족 경고',
      startTime: '2025-06-05 14:10:22',
      endTime: '-',
      state: '진행중',
    },
  ],
  service: [
    {
      id: 1,
      status: 'info',
      content: 'API Gateway 재시작',
      startTime: '2025-06-05 12:45:30',
      endTime: '2025-06-05 12:46:15',
      state: '완료',
    },
    {
      id: 2,
      status: 'warning',
      content: 'Auth Server 응답 지연',
      startTime: '2025-06-05 10:22:18',
      endTime: '-',
      state: '진행중',
    },
  ],
  log: [
    {
      id: 1,
      status: 'error',
      content: '데이터베이스 연결 실패',
      startTime: '2025-06-05 09:15:42',
      endTime: '-',
      state: '진행중',
    },
    {
      id: 2,
      status: 'info',
      content: '시스템 백업 완료',
      startTime: '2025-06-05 03:00:00',
      endTime: '2025-06-05 03:15:22',
      state: '완료',
    },
  ],
};

// 예시 로그 데이터
export const logData = [
  {
    id: 1,
    timestamp: '2025-06-05 15:45:23',
    level: 'ERROR',
    source: 'API Gateway',
    message: 'Connection timeout to auth-service after 30 seconds',
    details: 'Failed to establish connection to auth-service:8080. Retrying in 5 seconds...',
  },
  {
    id: 2,
    timestamp: '2025-06-05 15:44:18',
    level: 'WARNING',
    source: 'Database',
    message: 'High memory usage detected: 89%',
    details: 'Memory usage has exceeded 85% threshold. Consider scaling up the database instance.',
  },
  {
    id: 3,
    timestamp: '2025-06-05 15:43:45',
    level: 'INFO',
    source: 'Config Server',
    message: 'Configuration refreshed successfully',
    details: 'All microservices have been notified of configuration changes.',
  },
  {
    id: 4,
    timestamp: '2025-06-05 15:42:12',
    level: 'ERROR',
    source: 'Eureka Server',
    message: 'Service registration failed for user-service',
    details: 'Health check endpoint returned 503 status code. Service marked as DOWN.',
  },
  {
    id: 5,
    timestamp: '2025-06-05 15:41:33',
    level: 'WARNING',
    source: 'Load Balancer',
    message: 'Uneven traffic distribution detected',
    details: 'Server instance-1 receiving 70% of traffic while instance-2 receiving 30%.',
  },
  {
    id: 6,
    timestamp: '2025-06-05 15:40:55',
    level: 'INFO',
    source: 'API Gateway',
    message: 'Rate limiting applied to client 192.168.1.100',
    details: 'Client exceeded 1000 requests per minute limit. Throttling for 60 seconds.',
  },
  {
    id: 7,
    timestamp: '2025-06-05 15:39:42',
    level: 'ERROR',
    source: 'Payment Service',
    message: 'Payment processing failed for transaction TX-12345',
    details: 'External payment gateway returned error: INSUFFICIENT_FUNDS',
  },
  {
    id: 8,
    timestamp: '2025-06-05 15:38:17',
    level: 'INFO',
    source: 'User Service',
    message: 'User authentication successful',
    details: 'User ID: 98765 logged in from IP: 203.0.113.45',
  },
  {
    id: 9,
    timestamp: '2025-06-05 15:37:28',
    level: 'WARNING',
    source: 'Cache Server',
    message: 'Cache hit ratio below optimal threshold',
    details: 'Current hit ratio: 65%. Recommended minimum: 80%. Consider cache warming.',
  },
  {
    id: 10,
    timestamp: '2025-06-05 15:36:14',
    level: 'INFO',
    source: 'Monitoring',
    message: 'Health check completed for all services',
    details: '6 services checked: 5 healthy, 1 degraded (user-service)',
  },
  {
    id: 11,
    timestamp: '2025-06-05 15:35:03',
    level: 'ERROR',
    source: 'File Storage',
    message: 'Disk space critically low on /var/log partition',
    details: 'Available space: 2.1GB (5% remaining). Immediate cleanup required.',
  },
  {
    id: 12,
    timestamp: '2025-06-05 15:34:47',
    level: 'INFO',
    source: 'Backup Service',
    message: 'Daily backup completed successfully',
    details: 'Backup size: 2.4GB. Stored in S3 bucket: prod-backups-2025',
  },
];
