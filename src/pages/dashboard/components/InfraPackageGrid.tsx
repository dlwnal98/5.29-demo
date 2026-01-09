'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Server,
    ExternalLink,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { dashboardApps } from '@/constants/dashboard-data';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'running':
            return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-700 dark:text-green-100';
        case 'stopped':
            return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-700 dark:text-red-100';
        case 'warning':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-700 dark:text-yellow-100';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-100';
    }
};


export default function InfraPackageGrid() {

    const navigate = useNavigate();

    const handleAppClick = (url: string) => {
        if (!url.includes('http')) {
            navigate(url);
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="">
            {/* <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center dark:text-[#92C4FD]">
                <Server className="h-5 w-5 mr-2" />
                Infra Packages
            </h2> */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {dashboardApps.map((app) => {
                    return (
                        <Card
                            key={app.id}
                            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-blue-200/50 bg-white/70 backdrop-blur-sm hover:bg-white/80 hover:scale-105 dark:bg-[#303C9D1F]"
                            onClick={() => handleAppClick(app.url)}>
                            <CardContent className="px-3 py-4 text-center space-y-2">
                                <div className={`mx-auto h-12 w-12 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                    <div className="text-white">{app.icon}</div>
                                </div>
                                <h3 className="font-semibold text-sm truncate">{app.name}</h3>
                                <Badge variant="outline"
                                    className={`text-xs ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </Badge>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}