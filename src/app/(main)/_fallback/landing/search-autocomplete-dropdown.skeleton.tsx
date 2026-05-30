export function AutocompleteSkeleton() {
  return (
    <div className="p-2 space-y-2">
      <h4 className="px-2 py-1.5 text-xs font-semibold text-neutral-500">
        Searching packages...
      </h4>
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="flex flex-col items-start gap-2 p-2 rounded-sm bg-white/5 border border-white/5 animate-pulse"
        >
          <div className="h-4 w-2/3 bg-neutral-800 rounded" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-neutral-800" />
              <div className="h-3 w-20 bg-neutral-800 rounded" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-neutral-800" />
              <div className="h-3 w-12 bg-neutral-800 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}