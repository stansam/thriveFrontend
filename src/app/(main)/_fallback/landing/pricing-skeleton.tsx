"use client";

export function PricingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((card) => (
        <div
          key={card}
          className="relative flex flex-col rounded-2xl border border-white/10 bg-neutral-900/50 p-8 shadow-sm h-[400px]"
        >
          {/* Card Header */}
          <div className="mb-6 space-y-3">
            <div className="h-6 w-1/3 animate-pulse rounded bg-neutral-800" />
            <div className="h-10 w-1/2 animate-pulse rounded bg-neutral-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-800" />
          </div>

          {/* Features List */}
          <div className="mb-8 flex-1 space-y-4">
            {[1, 2, 3, 4].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="h-5 w-5 shrink-0 animate-pulse rounded-full bg-neutral-800" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-800" />
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}

export default PricingSkeleton;
