import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServiceCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow animate-pulse bg-gray-50 border-gray-200 dark:bg-[#23233a] dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-32 h-6 bg-gray-300 rounded" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-20 h-4 bg-gray-200 rounded" />
          <div className="w-10 h-4 bg-gray-100 rounded" />
        </div>
        <div className="space-y-2 max-h-[150px]">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded bg-gray-100 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <div>
                  <div className="w-24 h-4 bg-gray-200 rounded mb-1" />
                  <div className="w-32 h-3 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="flex flex-col items-end text-right space-y-1">
                <div className="w-16 h-4 bg-gray-200 rounded" />
                <div className="w-10 h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
