import { Suspense } from 'react'
import { DashboardContent } from '@/components/DashboardContent'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams

  return (
    <div className="px-4 py-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg border h-64"></div>
        ))}
      </div>
    </div>
  )
}
