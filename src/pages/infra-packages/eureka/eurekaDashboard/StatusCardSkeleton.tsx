import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusCardSkeletonProps {
  colSpan?: number;
}

export default function StatusCardSkeleton({
  colSpan = 1,
}: StatusCardSkeletonProps) {
  return (
    <Card
      className={`col-span-${colSpan} bg-gray-100 border border-gray-200 animate-pulse`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="w-24 h-4 bg-gray-300 rounded" />
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="w-20 h-6 bg-gray-300 rounded" />
            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );
}
