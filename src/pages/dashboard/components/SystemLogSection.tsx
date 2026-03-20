
'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
    HelpCircle,
    AlertCircle,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { tooltipDescriptions, eventData } from '@/constants/dashboard-mockData';
import { LogViewerModal } from '../components/LogViewerModal';

export default function SystemLogSection() {
    const [events, setEvents] = useState(eventData);


    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'error':
                return <XCircle className="h-4 w-4 text-red-500 dark:text-red-100" />;
            case 'warning':
                return <AlertCircle className="h-4 w-4 text-yellow-500 dark:text-yellow-100" />;
            default:
                return <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-100" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'error':
                return 'text-red-600 bg-red-50 border-red-200 dark:text-red-100 dark:bg-red-700';
            case 'warning':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-700 dark:text-yellow-100';
            default:
                return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-700 dark:text-green-100';
        }
    };

    return (
        <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm  dark:bg-[#303C9D1F]">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm">시스템 로그</h3>
                        <TooltipProvider>
                            <UITooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-64 text-sm">{tooltipDescriptions.events}</p>
                                </TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    </div>
                    <LogViewerModal />
                </div>

                <div className="border-t pt-4">
                    <div className="grid grid-cols-10 gap-4 text-xs text-gray-500 mb-2 px-2 text-center dark:text-card-foreground">
                        <span>상태</span>
                        <span className="col-span-3">내용</span>
                        <span className="col-span-2">발생일시</span>
                        <span className="col-span-2">종료일시</span>
                        <span className="col-span-2">상태</span>
                    </div>
                    {events.log.length > 0 ? (
                        <div className="space-y-2">
                            {events.log.map((event) => (
                                <div
                                    key={event.id}
                                    className={`grid grid-cols-10 gap-4 text-xs p-2 rounded-md ${getStatusClass(
                                        event.status
                                    )}`}
                                >
                                    <div className="flex items-center justify-center">
                                        {getStatusIcon(event.status)}
                                    </div>
                                    <span className="col-span-3 text-center">{event.content}</span>
                                    <span className="col-span-2">{event.startTime}</span>
                                    <span className="col-span-2">{event.endTime}</span>
                                    <span className="col-span-2 text-center">{event.state}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-sm text-gray-400">로그 이벤트가 없습니다.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}