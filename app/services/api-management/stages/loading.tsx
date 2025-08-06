import { AppLayout } from "@/components/layout/AppLayout"
import { Skeleton } from "@/components/ui/skeleton"

export default function StagesLoading() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar Skeleton */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-5 w-3/4 ml-4" />
                <Skeleton className="h-5 w-2/3 ml-8" />
                <Skeleton className="h-4 w-1/2 ml-12" />
                <Skeleton className="h-6 w-5/6" />
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="col-span-9">
            <div className="space-y-6">
              {/* Stage Details Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-8" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logs and Tracking Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </div>
                <div className="p-4">
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
