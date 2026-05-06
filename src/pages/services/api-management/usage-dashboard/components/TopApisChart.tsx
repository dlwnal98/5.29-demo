import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    TooltipProps
} from 'recharts'
import { formatNumber } from '@/libs/formatters'
import { TopApiData } from '../hooks/useUsageDashboard'

interface TopApisChartProps {
    data?: TopApiData[]
    height?: number
}

interface ProcessedApiData extends TopApiData {
    errorRate: number
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    payload?: Array<{
        payload: ProcessedApiData
    }>
}

function TopApisChart({ data = [], height = 300 }: TopApisChartProps) {
    // Calculate error rate for each API and determine color
    const processedData: ProcessedApiData[] = data.map(api => ({
        ...api,
        errorRate: api.requestCount > 0 && api.errorCount
            ? (api.errorCount / api.requestCount) * 100
            : api.errorRate || 0
    }))

    const getBarColor = (errorRate: number): string => {
        if (errorRate < 0.5) return '#10b981' // Green
        if (errorRate < 1) return '#f59e0b' // Yellow
        return '#ef4444' // Red
    }

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            const apiData = payload[0].payload
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-4 shadow-lg">
                    <p className="text-sm font-semibold text-slate-900 mb-2 pb-1 border-b border-slate-200">
                        {apiData.apiName || apiData.apiId}
                    </p>
                    <p className="text-sm text-slate-600 my-1">
                        요청 수: {formatNumber(apiData.requestCount)}
                    </p>
                    <p className="text-sm text-slate-600 my-1">
                        에러 수: {apiData.errorCount?.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600 my-1">
                        에러율: {apiData.errorRate.toFixed(2)}%
                    </p>
                    <p className="text-sm text-slate-600 my-1">
                        평균 응답시간: {Math.round(apiData.avgResponseTime || 0)}ms
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={processedData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148, 163, 184, 0.1)"
                        horizontal={false}
                    />
                    <XAxis
                        type="number"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => formatNumber(value)}
                    />
                    <YAxis
                        type="category"
                        dataKey="apiName"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={60}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                    <Bar
                        dataKey="requestCount"
                        radius={[0, 4, 4, 0]}
                        maxBarSize={30}
                    >
                        {processedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.errorRate)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TopApisChart
