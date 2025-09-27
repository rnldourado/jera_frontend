import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar placeholder */}
      <div className="w-72 bg-white border-r border-gray-200 hidden lg:block">
        <div className="p-6">
          <Skeleton className="h-8 w-20 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-2xl" />
          
          {/* Content cards */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
