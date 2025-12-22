import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Monitor,
    Plus,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// 예시 로그 데이터
const logData = [
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


export default function LogViewerModal() {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLogs = logData.filter((log) => {
        const matchesFilter =
            selectedFilter === "all" ||
            log.level.toLowerCase() === selectedFilter.toLowerCase();
        const matchesSearch =
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getLevelColor = (level: string) => {
        switch (level) {
            case "ERROR":
                return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20";
            case "WARNING":
                return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20";
            case "INFO":
                return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/20";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950/20";
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "ERROR":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "WARNING":
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
            case "INFO":
                return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
            default:
                return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
        }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 bg-transparent hover:dark:bg-gray-700 hover:dark:text-white">
                    <Plus className="h-4 w-4 text-gray-400" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] gap-1 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Monitor className="h-5 w-5" />
                        <span>시스템 로그 뷰어</span>
                    </DialogTitle>
                    <DialogDescription>
                        실시간 시스템 로그와 이벤트를 확인할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                {/* 필터 및 검색 */}
                <div className="flex flex-col sm:flex-row gap-4 py-4">
                    <div className="flex items-center space-x-2">
                        {/* <Label htmlFor="log-filter">필터:</Label> */}
                        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                <SelectItem value="error">ERROR</SelectItem>
                                <SelectItem value="warning">WARNING</SelectItem>
                                <SelectItem value="info">INFO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-1">
                        {/* <Input
                            placeholder="로그 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                            /> */}

                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4" />
                                {/* 새로고침 */}
                            </Button>
                            {/* <Button variant="outline" size="sm">
                                내보내기
                            </Button> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-[12px]">
                                ERROR: {logData.filter((log) => log.level === "ERROR").length}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-[12px]">
                                WARNING:{" "}
                                {logData.filter((log) => log.level === "WARNING").length}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-[12px]">
                                INFO: {logData.filter((log) => log.level === "INFO").length}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Badge variant="secondary" className="text-[13px] font-lightbold">
                                총 {filteredLogs.length}개 로그
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* 로그 목록 */}
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                    <div className="space-y-1 p-2">
                        {filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors dark:bg-gray-700/50"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        {getLevelIcon(log.level)}
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getLevelColor(log.level)}`}
                                        >
                                            {log.level}
                                        </Badge>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {log.source}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-200">{log.timestamp}</span>
                                </div>

                                <div className="mb-2">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                        {log.message}
                                    </p>
                                </div>

                                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-gray-300">
                                    {log.details}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredLogs.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Monitor className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>검색 조건에 맞는 로그가 없습니다.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
