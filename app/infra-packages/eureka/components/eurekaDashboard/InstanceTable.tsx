import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";

export default function InstanceTable({ data }: any) {
  return (
    <Card className="border-blue-200/50 bg-white/70 backdrop-blur-sm dark:bg-[#303C9D1F]">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            최근 등록/변경된 인스턴스
          </h3>
          <Badge variant="secondary" className="text-[14px]">
            {data?.recent?.length}개
          </Badge>
        </div>

        <div className="max-h-80 overflow-y-auto">
          <div className="space-y-1">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
              <div className="col-span-4">서비스명</div>
              <div className="col-span-3">인스턴스 ID</div>
              <div className="col-span-1">상태</div>
              <div className="col-span-4 text-center">등록시간</div>
            </div>

            {/* 테이블 바디 */}
            {data?.recent?.map((instance: any, index: number) => (
              <div
                key={instance.instanceId}
                className="grid grid-cols-12 gap-3 px-3 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <div className="col-span-4 flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {instance.serviceName}
                  </span>
                </div>

                <div className="col-span-3 flex items-center">
                  <span className="text-gray-600 dark:text-gray-300 truncate text-xs font-mono">
                    {instance.instanceId}
                  </span>
                </div>

                <div className="col-span-1 flex items-center">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      instance.status === "UP"
                        ? "text-green-700 bg-green-50 border-green-200 dark:text-green-100 dark:bg-green-900/30 dark:border-green-800"
                        : instance.status === "DOWN"
                        ? "text-red-700 bg-red-50 border-red-200 dark:text-red-100 dark:bg-red-900/30 dark:border-red-800"
                        : "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-100 dark:bg-yellow-900/30 dark:border-yellow-800"
                    }`}
                  >
                    {instance.status}
                  </Badge>
                </div>

                <div className="col-span-4 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs ">
                    {instance.lastUpdated}
                  </span>
                </div>
              </div>
            ))}

            {data?.recent?.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Server className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>최근 등록된 인스턴스가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
