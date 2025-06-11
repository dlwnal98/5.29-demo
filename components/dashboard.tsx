"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BarChart3,
  Server,
  Settings,
  Shield,
  Network,
  ExternalLink,
  Clock,
  Users,
  Database,
  Monitor,
  HelpCircle,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";
import axios from "axios";
import {
  dashboardApps,
  tooltipDescriptions,
  eventData,
  logData,
} from "../app/mockData/dashboardData";

// 로그 뷰어 모달 컴포넌트
function LogViewerModal() {
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
        return "text-red-600 bg-red-50 border-red-200";
      case "WARNING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "INFO":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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

  // 데이터 페칭
  // const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  // const { data } = useSWR("/api/metrics/cpu", fetcher, {
  //   refreshInterval: 5000,
  // });

  // const chartData = (data?.result || []).map((item: any) => ({
  //   time: new Date().toLocaleTimeString(),
  //   value: parseFloat(item.value[1]),
  // }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4 text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
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
            <Label htmlFor="log-filter">필터:</Label>
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
                <RefreshCw className="h-4 w-4 mr-2" />
                새로고침
              </Button>
              {/* <Button variant="outline" size="sm">
                내보내기
              </Button> */}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>
                ERROR: {logData.filter((log) => log.level === "ERROR").length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>
                WARNING:{" "}
                {logData.filter((log) => log.level === "WARNING").length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                INFO: {logData.filter((log) => log.level === "INFO").length}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>총 {filteredLogs.length}개 로그</span>
            </div>
          </div>
        </div>

        {/* 로그 목록 */}
        <div className="border rounded-lg max-h-96 overflow-y-auto">
          <div className="space-y-1 p-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
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
                    <span className="text-sm font-medium text-gray-700">
                      {log.source}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-900">
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

// 실시간 영역 차트 컴포넌트 (CPU, 메모리용)
function RealTimeAreaChart({
  title,
  dataKey,
  color = "#3b82f6",
  maxValue = 100,
  unit = "%",
  tooltipDescription,
}: {
  title: string;
  dataKey: string;
  color?: string;
  maxValue?: number;
  unit?: string;
  tooltipDescription: string;
}) {
  const [data, setData] = useState(() => {
    const initialData = [];
    const now = new Date();
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30000);
      initialData.push({
        time: time.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
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
          time: now.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          [dataKey]: newValue,
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [dataKey, maxValue, isCollecting]);

  const handleCollect = () => {
    setIsCollecting(true);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
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
                <linearGradient
                  id={`gradient-${dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#6b7280" }}
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
                tick={{ fontSize: 10, fill: "#6b7280" }}
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

// 네트워크 차트 컴포넌트
function NetworkChart() {
  const [data, setData] = useState(() => {
    const initialData = [];
    const now = new Date();
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30000);
      initialData.push({
        time: time.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
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

  const [activeTab, setActiveTab] = useState("PPS");
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
          time: now.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
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

  const handleCollect = () => {
    setIsCollecting(true);
  };

  const networkLines = {
    PPS: [
      { key: "vnet40_in_pps", color: "#10b981", name: "vnet40 In" },
      { key: "vnet36_in_pps", color: "#06b6d4", name: "vnet36 In" },
      { key: "vnet6_in_pps", color: "#f59e0b", name: "vnet6 In" },
      { key: "nfbr0_in_pps", color: "#8b5cf6", name: "nfbr0 In" },
      { key: "vnet40_out_pps", color: "#ef4444", name: "vnet40 Out" },
    ],
    BPS: [
      { key: "vnet40_in_bps", color: "#10b981", name: "vnet40 In" },
      { key: "vnet36_in_bps", color: "#06b6d4", name: "vnet36 In" },
      { key: "vnet6_in_bps", color: "#f59e0b", name: "vnet6 In" },
      { key: "nfbr0_in_bps", color: "#8b5cf6", name: "nfbr0 In" },
      { key: "vnet40_out_bps", color: "#ef4444", name: "vnet40 Out" },
    ],
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium mb-2">{`시간: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(0)} ${
                activeTab === "PPS" ? "pps" : "Mbps"
              }`}
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
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
        </div>

        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "BPS" ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setActiveTab("BPS")}
          >
            BPS
          </Button>
          <Button
            variant={activeTab === "PPS" ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => setActiveTab("PPS")}
          >
            PPS
          </Button>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickFormatter={(value) => value.slice(0, 5)}
                tickMargin={8}
                // interval="preserveStartEnd"
                interval={1}
                padding={{ left: 20, right: 0 }}
              />
              <YAxis
                domain={activeTab === "PPS" ? [0, 500] : [0, 600]}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickFormatter={(value) =>
                  `${value} ${activeTab === "PPS" ? "pps" : "Mbps"}`
                }
                allowDataOverflow={true}
              />
              <Tooltip content={<CustomTooltip />} />
              {networkLines[activeTab as keyof typeof networkLines].map(
                (line) => (
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
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {networkLines[activeTab as keyof typeof networkLines].map((line) => (
            <div key={line.key} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: line.color }}
              ></div>
              <span>{line.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 디스크 사용량 컴포넌트
function DiskUsage() {
  const [isCollecting, setIsCollecting] = useState(false);

  const handleCollect = () => {
    setIsCollecting(true);
    setTimeout(() => setIsCollecting(false), 1500);
  };

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
                  width: "3.16%",
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
            <div className="text-right text-xs text-green-600 font-medium">
              3.16%
            </div>
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
                  width: "45.55%",
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
            <div className="text-right text-xs text-blue-600 font-medium">
              45.55%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 이벤트 컴포넌트
function EventsSection() {
  const [events, setEvents] = useState(eventData);
  const [activeTab, setActiveTab] = useState("기본정보");

  const handleAddEvent = (newEvent: any) => {
    setEvents((prev) => {
      const tabKey =
        activeTab === "기본정보"
          ? "basic"
          : activeTab === "서비스"
          ? "service"
          : "log";
      return {
        ...prev,
        [tabKey]: [newEvent, ...prev[tabKey as keyof typeof prev]],
      };
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500 dark:text-red-100" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500 dark:text-yellow-100" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-100" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "error":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-100 dark:bg-red-700";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-700 dark:text-yellow-100";
      default:
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-700 dark:text-green-100";
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
                      <span className="col-span-3 text-center">
                        {event.content}
                      </span>
                      <span className="col-span-2">{event.startTime}</span>
                      <span className="col-span-2">{event.endTime}</span>
                      <span className="col-span-2 text-center">
                        {event.state}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-gray-400">
                  로그 이벤트가 없습니다.
                </div>
              )}
            </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const handleAppClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-700 dark:text-green-100";
      case "stopped":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-700 dark:text-red-100";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-700 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 py-6">

        {/* Apps Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center dark:text-[#92C4FD]">
            <Server className="h-5 w-5 mr-2" />
            Infra Packages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {dashboardApps.map((app) => (
              <Card
                key={app.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-blue-200/50 bg-white/70 backdrop-blur-sm hover:bg-white/80 hover:scale-105 dark:bg-[#303C9D1F]"
                onClick={() => handleAppClick(app.url)}
              >
                <CardContent className="p-6 text-center">
                  {/* App Icon */}
                  <div
                    className={`mx-auto mb-4 h-16 w-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="text-white">{app.icon}</div>
                  </div>

                  {/* App Name */}
                  <h3 className="font-semibold text-sm mb-2 truncate">
                    {app.name}
                  </h3>

                  {/* App Description */}
                  {/* <p className="text-xs text-muted-foreground mb-3 line-clamp-2 h-8">
                    {app.description}
                  </p> */}

                  {/* Status Badge */}
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(app.status)} mb-2`}
                  >
                    {app.status}
                  </Badge>

                  {/* Version */}
                  {/* <p className="text-xs text-muted-foreground">
                    v{app.version}
                  </p> */}

                  {/* External Link Icon */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Server Monitoring Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center dark:text-[#92C4FD]">
            <Monitor className="h-5 w-5 mr-2" />
            Server Monitoring
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* CPU Chart */}
            <RealTimeAreaChart
              title="CPU"
              dataKey="cpu"
              color="#3b82f6"
              maxValue={100}
              unit="%"
              tooltipDescription={tooltipDescriptions.cpu}
            />

            {/* Memory Chart */}
            <RealTimeAreaChart
              title="메모리"
              dataKey="memory"
              color="#7761F2"
              maxValue={100}
              unit="%"
              tooltipDescription={tooltipDescriptions.memory}
            />

            {/* Disk Usage */}
            <DiskUsage />

            {/* Network Chart - spans 2 columns */}
            <div className="lg:col-span-2">
              <NetworkChart />
            </div>

            {/* Events Section */}
            <EventsSection />
          </div>
        </div>

        {/* Footer Info */}
        {/* <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div> */}
      </div>
    </div>
  );
}
