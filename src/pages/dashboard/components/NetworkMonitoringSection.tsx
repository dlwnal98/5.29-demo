
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    HelpCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
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
import { tooltipDescriptions } from '@/constants/dashboard-data';

export default function NetworkMonitoringSection() {
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
                // PPS 데이터
                vnet40_in_pps: Math.random() * 150 + 100,
                vnet36_in_pps: Math.random() * 100 + 50,
                vnet6_in_pps: Math.random() * 80 + 30,
                nfbr0_in_pps: Math.random() * 120 + 80,
                vnet40_out_pps: Math.random() * 90 + 40,
                // BPS 데이터 (Mbps)
                vnet40_in_bps: Math.random() * 250 + 150,
                vnet36_in_bps: Math.random() * 180 + 100,
                vnet6_in_bps: Math.random() * 120 + 80,
                nfbr0_in_bps: Math.random() * 200 + 120,
                vnet40_out_bps: Math.random() * 150 + 90,
            });
        }
        return initialData;
    });

    const [activeTab, setActiveTab] = useState('PPS');
    const [isCollecting, setIsCollecting] = useState(true);

    useEffect(() => {
        if (!isCollecting) return;

        const interval = setInterval(() => {
            setData((prevData) => {
                const newData = [...prevData.slice(1)];
                const now = new Date();
                const lastData = prevData[prevData.length - 1];

                // 이전 값에 약간의 변동을 주어 자연스러운 변화 만들기
                const newPoint: any = {
                    time: now.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                };

                // PPS 데이터 업데이트
                newPoint.vnet40_in_pps = Math.max(
                    50,
                    Math.min(400, lastData.vnet40_in_pps + (Math.random() * 40 - 20))
                );
                newPoint.vnet36_in_pps = Math.max(
                    30,
                    Math.min(300, lastData.vnet36_in_pps + (Math.random() * 30 - 15))
                );
                newPoint.vnet6_in_pps = Math.max(
                    20,
                    Math.min(200, lastData.vnet6_in_pps + (Math.random() * 20 - 10))
                );
                newPoint.nfbr0_in_pps = Math.max(
                    40,
                    Math.min(350, lastData.nfbr0_in_pps + (Math.random() * 35 - 17.5))
                );
                newPoint.vnet40_out_pps = Math.max(
                    20,
                    Math.min(250, lastData.vnet40_out_pps + (Math.random() * 25 - 12.5))
                );

                // BPS 데이터 업데이트
                newPoint.vnet40_in_bps = Math.max(
                    100,
                    Math.min(600, lastData.vnet40_in_bps + (Math.random() * 60 - 30))
                );
                newPoint.vnet36_in_bps = Math.max(
                    80,
                    Math.min(500, lastData.vnet36_in_bps + (Math.random() * 50 - 25))
                );
                newPoint.vnet6_in_bps = Math.max(
                    50,
                    Math.min(400, lastData.vnet6_in_bps + (Math.random() * 40 - 20))
                );
                newPoint.nfbr0_in_bps = Math.max(
                    90,
                    Math.min(550, lastData.nfbr0_in_bps + (Math.random() * 55 - 27.5))
                );
                newPoint.vnet40_out_bps = Math.max(
                    70,
                    Math.min(450, lastData.vnet40_out_bps + (Math.random() * 45 - 22.5))
                );

                newData.push(newPoint);
                return newData;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [isCollecting]);


    const networkLines = {
        PPS: [
            { key: 'vnet40_in_pps', color: '#10b981', name: 'vnet40 In' },
            { key: 'vnet36_in_pps', color: '#06b6d4', name: 'vnet36 In' },
            { key: 'vnet6_in_pps', color: '#f59e0b', name: 'vnet6 In' },
            { key: 'nfbr0_in_pps', color: '#8b5cf6', name: 'nfbr0 In' },
            { key: 'vnet40_out_pps', color: '#ef4444', name: 'vnet40 Out' },
        ],
        BPS: [
            { key: 'vnet40_in_bps', color: '#10b981', name: 'vnet40 In' },
            { key: 'vnet36_in_bps', color: '#06b6d4', name: 'vnet36 In' },
            { key: 'vnet6_in_bps', color: '#f59e0b', name: 'vnet6 In' },
            { key: 'nfbr0_in_bps', color: '#8b5cf6', name: 'nfbr0 In' },
            { key: 'vnet40_out_bps', color: '#ef4444', name: 'vnet40 Out' },
        ],
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded shadow-lg  dark:bg-gray-800 z-[999px]">
                    <p className="text-sm font-medium mb-2">{`시간: ${label}`}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value.toFixed(0)} ${activeTab === 'PPS' ? 'pps' : 'Mbps'}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
                <div className="flex justify-between">
                    <div className="flex space-x-2">
                        <h3 className="font-semibold text-sm">네트워크</h3>
                        <TooltipProvider>
                            <UITooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-64 text-sm">{tooltipDescriptions.network}</p>
                                </TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex space-x-2 mb-4">
                        <Button
                            variant={activeTab === 'BPS' ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => setActiveTab('BPS')}
                        >
                            BPS
                        </Button>
                        <Button
                            variant={activeTab === 'PPS' ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => setActiveTab('PPS')}
                        >
                            PPS
                        </Button>
                    </div>
                </div>



                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                tickFormatter={(value) => value.slice(0, 5)}
                                tickMargin={8}
                                // interval="preserveStartEnd"
                                interval={1}
                                padding={{ left: 20, right: 0 }}
                            />
                            <YAxis
                                domain={activeTab === 'PPS' ? [0, 500] : [0, 600]}
                                axisLine={false}
                                tickLine={false}
                                tickMargin={8}
                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                tickFormatter={(value) => `${value} ${activeTab === 'PPS' ? 'pps' : 'Mbps'}`}
                                allowDataOverflow={true}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {networkLines[activeTab as keyof typeof networkLines].map((line) => (
                                <Line
                                    key={line.key}
                                    type="monotone"
                                    dataKey={line.key}
                                    stroke={line.color}
                                    strokeWidth={2}
                                    dot={false}
                                    name={line.name}
                                    isAnimationActive={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    {networkLines[activeTab as keyof typeof networkLines].map((line) => (
                        <div key={line.key} className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }}></div>
                            <span>{line.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}