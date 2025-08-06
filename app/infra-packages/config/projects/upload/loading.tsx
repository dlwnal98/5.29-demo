import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner className="h-8 w-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading upload page...</p>
      </div>
    </div>
  )
}
