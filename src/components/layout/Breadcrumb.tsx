import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Crumb = { label: string; href?: string }

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {it.href ? (
              <Link href={it.href} className="hover:underline text-foreground">{it.label}</Link>
            ) : (
              <span className="text-foreground font-medium">{it.label}</span>
            )}
            {idx < items.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
