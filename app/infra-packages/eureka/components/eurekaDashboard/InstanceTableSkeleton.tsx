import { Card, CardContent } from "@/components/ui/card";

export default function InstanceTableSkeleton() {
  return (
    <Card className="border-gray-200 bg-gray-50 dark:bg-[#1E1E2F] animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-40 h-6 bg-gray-300 rounded" />
          <div className="w-10 h-6 bg-gray-200 rounded" />
        </div>
        <div className="max-h-80 overflow-y-auto">
          <div className="space-y-1">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium dark:bg-gray-800/60 rounded-t-lg">
              <div className="col-span-4 h-4 bg-gray-300 rounded" />
              <div className="col-span-3 h-4 bg-gray-300 rounded" />
              <div className="col-span-1 h-4 bg-gray-300 rounded" />
              <div className="col-span-4 h-4 bg-gray-300 rounded" />
            </div>
            {/* 스켈레톤 바디 */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-3 px-3 py-3 border-b border-gray-100 dark:border-gray-700"
              >
                <div className="col-span-4 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="col-span-3 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="col-span-1 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="col-span-4 h-4 bg-gray-200 dark:bg-gray-600 rounded" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
