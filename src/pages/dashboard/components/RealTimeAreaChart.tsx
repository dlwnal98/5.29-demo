import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface RealTimeAreaChartProps {
    title: string;
    dataKey: string;
    color?: string;
    maxValue?: number;
    unit?: string;
    tooltipDescription: string;
}

export function RealTimeAreaChart({
    title,
    dataKey,
    color = '#3b82f6',
    maxValue = 100,
    unit = '%',
    tooltipDescription,
}: RealTimeAreaChartProps) {
    const [data, setData] = useState(() => {
        const initialData = [];
        const now = new Date();
        for (let i = 19; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 30000);
            initialData.push({
                time: time.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }),
                [dataKey]: Math.random() * (maxValue / 3) + 5, // 초기값은 낮게 설정
            });
        }
        return initialData;
    });

    const [isCollecting, setIsCollecting] = useState(true);

    useEffect(() => {
        if (!isCollecting) return;

        const interval = setInterval(() => {
            setData((prevData) => {
                const newData = [...prevData.slice(1)];
                const now = new Date();
                // 이전 값에 약간의 변동을 주어 자연스러운 변화 만들기
                const lastValue = prevData[prevData.length - 1][dataKey];
                const change = Math.random() * 5 - 2.5; // -2.5 ~ 2.5 사이의 변화
                let newValue = (lastValue as number) + change;
                // 값의 범위 제한
                newValue = Math.max(0, Math.min(maxValue, newValue));

                newData.push({
                    time: now.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                    [dataKey]: newValue,
                });
                return newData;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [dataKey, maxValue, isCollecting]);


    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 rounded shadow-lg dark:bg-gray-800  z-[999px]">
                    <p className="text-sm">{`시간: ${label}`}</p>
                    <p className="text-sm" style={{ color }}>
                        {`${title}: ${payload[0].value.toFixed(1)}${unit}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm">{title}</h3>
                        <TooltipProvider>
                            <UITooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-64 text-sm">{tooltipDescription}</p>
                                </TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <div className="h-40">
                    <ResponsiveContainer height="100%">
                        <AreaChart
                            data={data}
                            // 아래는 api로 데이터 받아왓을 때
                            // data={chartData}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                            <defs>
                                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                tickMargin={10}
                                // interval="preserveStartEnd"
                                interval={2}
                                // padding={{ left: 20, right: 0 }}
                                tickFormatter={(value) => value.slice(0, 5)}
                            />
                            <YAxis
                                domain={[0, maxValue]}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                width={40}
                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                tickFormatter={(value) => `${value}${unit}`}
                                allowDataOverflow={true}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                strokeWidth={2}
                                fill={`url(#gradient-${dataKey})`}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
