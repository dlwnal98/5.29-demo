import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    TooltipProps
} from 'recharts'
import { formatChartTime } from '@/libs/formatters'
import { RealtimeDataPoint } from '../hooks/useUsageDashboard'

interface ErrorRateChartProps {
    data?: RealtimeDataPoint[]
    height?: number
}

interface CustomTooltipProps extends TooltipProps<number, string> {}

function ErrorRateChart({ data = [], height = 300 }: ErrorRateChartProps) {
    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-4 shadow-lg">
                    <p className="text-sm font-semibold text-slate-900 mb-2 pb-1 border-b border-slate-200">
                        {formatChartTime(label)}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm text-slate-600 my-1" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="color4xx" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="color5xx" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(148, 163, 184, 0.1)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatChartTime}
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: '10px' }}
                        iconType="circle"
                        formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                    />
                    <Area
                        type="monotone"
                        dataKey="clientErrors"
                        name="4xx 에러"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#color4xx)"
                        stackId="1"
                    />
                    <Area
                        type="monotone"
                        dataKey="serverErrors"
                        name="5xx 에러"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#color5xx)"
                        stackId="1"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ErrorRateChart
