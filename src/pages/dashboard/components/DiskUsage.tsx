import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Database } from 'lucide-react';
import {
    Tooltip as UITooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { tooltipDescriptions } from '@/constants/dashboard-data';

export function DiskUsage() {

    return (
        <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm">디스크</h3>
                        <TooltipProvider>
                            <UITooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="w-64 text-sm">{tooltipDescriptions.disk}</p>
                                </TooltipContent>
                            </UITooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <div className="mt-4">
                    <div>
                        <div className="flex items-center space-x-1 mb-3">
                            <Database className="w-3.5 h-3.5" stroke="gray" />
                            <span className="text-sm font-medium">/</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2 dark:text-card-foreground">
                            13.7 GB of 432.8 GB
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-1 overflow-hidden">
                            <div
                                className="h-3 rounded-full transition-all animate-stripe"
                                style={{
                                    width: '3.16%',
                                    backgroundImage: `
          repeating-linear-gradient(
            45deg,
            #22c55e 0px,
            #22c55e 4px,
            #4ade80 4px,
            #4ade80 8px
          )
        `,
                                }}
                            ></div>
                        </div>
                        <div className="text-right text-xs text-green-600 font-medium">3.16%</div>
                    </div>

                    <div>
                        <div className="flex items-center space-x-1 mb-3">
                            <Database className="w-3.5 h-3.5" stroke="gray" />
                            <span className="text-sm font-medium">/boot</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2 dark:text-card-foreground">
                            461.7 MB of 1014 MB
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-1 overflow-hidden">
                            <div
                                className="h-3 rounded-full transition-all animate-stripe"
                                style={{
                                    width: '45.55%',
                                    backgroundImage: `
          repeating-linear-gradient(
            45deg,
            #2563eb 0px,
            #2563eb 4px,
            #3b82f6 4px,
            #3b82f6 8px
          )
        `,
                                }}
                            ></div>
                        </div>
                        <div className="text-right text-xs text-blue-600 font-medium">45.55%</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
