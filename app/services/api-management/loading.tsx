import { AppLayout } from "@/components/layout/AppLayout"
import { Skeleton } from "@/components/ui/skeleton"

export default function ApiManagementLoading() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <Skeleton className="h-10 w-64 bg-white/20" />
            <Skeleton className="h-6 w-48 bg-white/20 mt-2" />
            <Skeleton className="h-4 w-96 bg-white/20 mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    </AppLayout>
  )
}
