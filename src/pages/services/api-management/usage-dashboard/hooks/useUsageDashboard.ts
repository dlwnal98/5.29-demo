import { useState, useEffect } from 'react'

export interface SummaryData {
    totalRequests: number
    todayRequests: number
    yesterdayRequests: number
    successRate: number
    yesterdaySuccessRate: number
    avgResponseTimeMs: number
    yesterdayAvgResponseTime: number
}

export interface RealtimeDataPoint {
    timestamp: string
    requestCount: number
    avgResponseTime: number
    errorCount: number
    clientErrors: number
    serverErrors: number
}

export interface TopApiData {
    apiId: string
    apiName?: string
    requestCount: number
    errorRate: number
    errorCount?: number
    avgResponseTime?: number
}

export interface LogEntry {
    eventId: string
    timestamp: string
    apiId: string
    httpMethod: string
    resourcePath: string
    statusCode: number
    responseTimeMs: number
    clientIp: string
}

export interface HistoryData {
    content: LogEntry[]
    totalElements: number
    totalPages: number
}

export interface ResponseTimeData {
    avgResponseTime: number
    minResponseTime: number
    maxResponseTime: number
    p50: number
    p95: number
    p99: number
}

export function useUsageDashboard() {
    const [summary, setSummary] = useState<SummaryData | null>(null)
    const [realtimeData, setRealtimeData] = useState<RealtimeDataPoint[]>([])
    const [topApis, setTopApis] = useState<TopApiData[]>([])
    const [historyData, setHistoryData] = useState<HistoryData>({
        content: [],
        totalElements: 0,
        totalPages: 1
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)

        // Mock Summary
        setSummary({
            totalRequests: 1254300,
            todayRequests: 45230,
            yesterdayRequests: 41200,
            successRate: 99.8,
            yesterdaySuccessRate: 99.2,
            avgResponseTimeMs: 145,
            yesterdayAvgResponseTime: 160
        })

        // Mock Realtime Data (30 points)
        const now = new Date()
        const mockRealtime: RealtimeDataPoint[] = Array.from({ length: 30 }, (_, i) => {
            const time = new Date(now.getTime() - (29 - i) * 5000)
            const baseRps = 500 + Math.random() * 200
            return {
                timestamp: time.toISOString(),
                requestCount: Math.floor(baseRps),
                avgResponseTime: 120 + Math.random() * 50,
                errorCount: Math.floor(Math.random() * 5),
                clientErrors: Math.floor(Math.random() * 4),
                serverErrors: Math.floor(Math.random() * 1)
            }
        })
        setRealtimeData(mockRealtime)

        // Mock Top APIs
        setTopApis([
            { apiId: 'User Service', apiName: 'User Service', requestCount: 54321, errorRate: 0.5, errorCount: 271, avgResponseTime: 120 },
            { apiId: 'Product API', apiName: 'Product API', requestCount: 43210, errorRate: 1.2, errorCount: 518, avgResponseTime: 145 },
            { apiId: 'Order System', apiName: 'Order System', requestCount: 32100, errorRate: 0.8, errorCount: 256, avgResponseTime: 180 },
            { apiId: 'Auth Service', apiName: 'Auth Service', requestCount: 21000, errorRate: 2.5, errorCount: 525, avgResponseTime: 95 },
            { apiId: 'Payment GW', apiName: 'Payment GW', requestCount: 15000, errorRate: 0.1, errorCount: 15, avgResponseTime: 250 }
        ])

        // Mock History
        const mockLogs: LogEntry[] = Array.from({ length: 10 }, (_, i) => ({
            eventId: `evt-${i}`,
            timestamp: new Date(now.getTime() - i * 10000).toISOString(),
            apiId: ['User Service', 'Product API', 'Order System'][Math.floor(Math.random() * 3)],
            httpMethod: ['GET', 'POST', 'PUT'][Math.floor(Math.random() * 3)],
            resourcePath: ['/users', '/products', '/orders'][Math.floor(Math.random() * 3)],
            statusCode: [200, 201, 400, 500][Math.floor(Math.random() * 4)],
            responseTimeMs: Math.floor(Math.random() * 200) + 20,
            clientIp: `192.168.1.${100 + i}`
        }))
        setHistoryData({
            content: mockLogs,
            totalElements: 100,
            totalPages: 10
        })

        setIsLoading(false)

        // Simulate Realtime Updates
        const interval = setInterval(() => {
            setRealtimeData(prev => {
                if (prev.length === 0) return prev
                const nextTime = new Date(new Date(prev[prev.length - 1].timestamp).getTime() + 5000)
                const newPoint: RealtimeDataPoint = {
                    timestamp: nextTime.toISOString(),
                    requestCount: Math.floor(500 + Math.random() * 200),
                    avgResponseTime: 120 + Math.random() * 50,
                    errorCount: Math.floor(Math.random() * 5),
                    clientErrors: Math.floor(Math.random() * 4),
                    serverErrors: Math.floor(Math.random() * 1)
                }
                return [...prev.slice(1), newPoint]
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const calculateChange = (current: number, previous: number): number => {
        if (!previous || previous === 0) return 0
        return ((current - previous) / previous) * 100
    }

    const responseTimeData: ResponseTimeData | null = summary ? {
        avgResponseTime: summary.avgResponseTimeMs,
        minResponseTime: 45,
        maxResponseTime: 1200,
        p50: 130,
        p95: 350,
        p99: 800
    } : null

    return {
        summary,
        realtimeData,
        topApis,
        historyData,
        currentPage,
        isLoading,
        responseTimeData,
        setCurrentPage,
        calculateChange
    }
}
