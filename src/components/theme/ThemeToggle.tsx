'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  /** Sur le hero sombre (accueil), icônes claires */
  hero?: boolean
}

export function ThemeToggle({ hero }: Props) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  const iconClass = cn(
    'h-[1.15rem] w-[1.15rem] shrink-0',
    // only use the 'hero' (white) style when we are actually in dark theme
    hero && isDark ? 'text-white/90' : 'text-neutral-600 dark:text-neutral-300'
  )

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn('rounded-full', hero && isDark ? 'text-white/80 hover:bg-card/10' : '')}
        aria-label="Thème"
      >
        <span className="h-[1.15rem] w-[1.15rem]" />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn(
        'rounded-full focus-visible:ring-2 focus-visible:ring-primary/40',
        hero && isDark
          ? 'text-white/90 hover:bg-card/15'
          : 'text-neutral-600 hover:bg-neutral-200/70 dark:text-neutral-300 dark:hover:bg-neutral-800/80'
      )}
      aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Moon className={iconClass} /> : <Sun className={iconClass} />}
    </Button>
  )
}
