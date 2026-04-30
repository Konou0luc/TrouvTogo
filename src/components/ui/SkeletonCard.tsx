// src/components/ui/SkeletonCard.tsx
export default function SkeletonCard() {
  return (
    <div className="flex h-[260px] animate-pulse overflow-hidden rounded-[2.5rem] border border-neutral-200/50 bg-card">
      <div className="h-full w-2/5 bg-muted dark:bg-muted" />
      <div className="flex flex-1 flex-col justify-between p-8">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-muted dark:bg-muted" />
            <div className="h-6 w-20 rounded-full bg-muted dark:bg-muted" />
          </div>
          <div className="h-8 w-3/4 rounded-xl bg-muted dark:bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted dark:bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted dark:bg-muted" />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-6 dark:border-neutral-700">
          <div className="flex gap-4">
            <div className="h-4 w-16 rounded bg-muted dark:bg-muted" />
            <div className="h-4 w-16 rounded bg-muted dark:bg-muted" />
          </div>
          <div className="h-6 w-20 rounded-full bg-muted dark:bg-muted" />
        </div>
      </div>
    </div>
  )
}
