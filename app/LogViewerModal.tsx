import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import axios from "axios";
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

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logData } from "@/constants/dashboardData";

export function LogViewerModal() {
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
