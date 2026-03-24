import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IS_DEV } from '@/lib/constants/env.constants'
import { PackageCardSkeleton } from '../_package-card/package-card-skeleton'
import { FeaturedPackagesStatesProps } from '../../../_props/landing/featured.props'

export function FeaturedPackagesStates({
  isLoading,
  isError,
  isEmpty,
}: FeaturedPackagesStatesProps) {
  return (
    <>
      {isLoading && (
        <div
          role="status"
          aria-label="Loading featured tours"
          className="flex w-full gap-5 overflow-hidden pl-4 lg:pl-[max(8rem,calc(50vw-700px))]"
        >
          {[1, 2, 3, 4].map((i) => (
            <PackageCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && !IS_DEV && (
        <div className="flex flex-col justify-center items-center h-64 text-error-500 gap-2">
          <AlertCircle className="h-8 w-8" aria-hidden />
          <p className="text-white">Unable to load featured tours at this time.</p>
          <Button
            variant="outline"
            className="mt-4 border-white/20 text-white hover:bg-white/10"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && isEmpty && !IS_DEV && (
        <div className="flex flex-col justify-center items-center h-64 text-neutral-500 gap-2">
          <p>No featured tours available at this time. Check back soon.</p>
        </div>
      )}
    </>
  )
}
