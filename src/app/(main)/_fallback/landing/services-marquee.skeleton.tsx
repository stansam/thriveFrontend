"use client";

export function ServicesMarqueeSkeleton() {
  return (
    <section className="bg-black py-16 text-white overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <div className="mx-auto h-8 w-64 animate-pulse rounded bg-neutral-800" />
        <div className="mx-auto mt-2 h-4 w-96 animate-pulse rounded bg-neutral-800" />
      </div>
      <div className="flex gap-4 px-4 overflow-x-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 w-72 shrink-0 animate-pulse rounded-xl border border-white/10 bg-neutral-900/50 p-6"
          >
            <div className="h-6 w-6 rounded bg-neutral-800" />
            <div className="mt-4 h-4 w-40 rounded bg-neutral-800" />
            <div className="mt-2 h-3 w-56 rounded bg-neutral-800" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesMarqueeSkeleton;
