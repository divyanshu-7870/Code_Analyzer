import { Card } from '../ui/Card'
import { Skeleton } from '../ui/Skeleton'

export function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-5 h-12 w-24" />
        <Skeleton className="mt-4 h-3 w-full" />
      </Card>
      <Card className="p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-5 h-3 w-full" />
        <Skeleton className="mt-3 h-3 w-11/12" />
        <Skeleton className="mt-3 h-3 w-2/3" />
      </Card>
      {[0, 1, 2].map((item) => (
        <Card key={item} className="p-5">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-5 h-4 w-10/12" />
          <Skeleton className="mt-3 h-4 w-8/12" />
        </Card>
      ))}
    </div>
  )
}
