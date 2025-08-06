import { AppLayout } from "@/components/layout/AppLayout"
import { Skeleton } from "@/components/ui/skeleton"

export default function ServicesLoading() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-10 w-16" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
