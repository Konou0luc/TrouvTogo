// src/components/ui/SkeletonCard.tsx
export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 h-[260px] flex animate-pulse">
      <div className="w-2/5 h-full bg-neutral-100" />
      <div className="flex-1 p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-neutral-100 rounded-full" />
            <div className="h-6 w-20 bg-neutral-100 rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-neutral-100 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-neutral-50 rounded" />
            <div className="h-4 w-5/6 bg-neutral-50 rounded" />
          </div>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-neutral-50">
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-neutral-50 rounded" />
            <div className="h-4 w-16 bg-neutral-50 rounded" />
          </div>
          <div className="h-6 w-20 bg-neutral-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}
