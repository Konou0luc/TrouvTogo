'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1695643875095-f5620748605d?w=1400&q=85',
    alt: 'Scène de marché en Afrique de l’Est',
    caption: 'Une communauté qui partage les signalements au bon endroit.',
  },
  {
    src: 'https://images.unsplash.com/photo-1765584829997-12ab011bb5b3?w=1400&q=85',
    alt: 'Étal de rue au Nigeria',
    caption: 'Du quotidien : marchés, trajets, objets qui comptent.',
  },
  {
    src: 'https://images.unsplash.com/photo-1734255287995-7c09dbc99613?w=1400&q=85',
    alt: 'Marché en Afrique de l’Ouest',
    caption: 'La confiance se construit dans la vie des quartiers.',
  },
  {
    src: 'https://images.unsplash.com/photo-1734868198180-645349d586f4?w=1400&q=85',
    alt: 'Rue à Lomé, Togo',
    caption: 'À Lomé et partout au Togo, suivez vos signalements en un coup d’œil.',
  },
] as const

export function HomeStoryCarousel() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(0)

  const isDark = mounted && resolvedTheme === 'dark'

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 6000)
    return () => window.clearInterval(t)
  }, [])

  const go = (d: number) =>
    setIndex((i) => (i + d + SLIDES.length) % SLIDES.length)

  return (
    <section
      className={cn(
        'py-20 lg:py-24',
        isDark ? 'bg-[#101214]' : 'bg-[#f8f7f4]'
      )}
    >
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Terrain</p>
          <h2
            className={cn(
              'display-heading mt-3 text-3xl sm:text-4xl',
              isDark ? 'text-[#f0efe9]' : 'text-[#1c1b18]'
            )}
          >
            Le service en contexte réel
          </h2>
          <p
            className={cn(
              'mt-4 text-[17px] leading-relaxed',
              isDark ? 'text-[#b5b1a8]' : 'text-[#4a4842]'
            )}
          >
            Des situations du quotidien — la plateforme reste sobre pour mieux servir l’action.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-card shadow-none dark:border-neutral-700/60">
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="relative aspect-[4/3] min-h-[240px] lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={SLIDES[index].src}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={SLIDES[index].src}
                    alt={SLIDES[index].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/20" />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col justify-between border-t border-neutral-200/50 bg-card p-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-10 dark:border-neutral-700/60">
              <div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={SLIDES[index].caption}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="text-lg font-medium leading-relaxed text-card-foreground"
                  >
                    {SLIDES[index].caption}
                  </motion.p>
                </AnimatePresence>
                <p
                  className={cn(
                    'mt-6 text-sm',
                    isDark ? 'text-[#a8a59a]' : 'text-[#5f5e58]'
                  )}
                >
                  Images d’illustration — votre parcours reste 100 % gratuit et centré sur la confiance.
                </p>
              </div>

              <div className="mt-10 flex items-center justify-between gap-4">
                <div className="flex gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Diapositive ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        i === index
                          ? 'w-8 bg-primary'
                          : isDark
                            ? 'w-2 bg-neutral-600 hover:bg-neutral-500'
                            : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:border-primary/40 hover:text-primary',
                      isDark
                        ? 'border-neutral-600 bg-neutral-900 text-[#f0efe9]'
                        : 'border-neutral-200/60 bg-white text-[#1c1b18]'
                    )}
                    aria-label="Précédent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:border-primary/40 hover:text-primary',
                      isDark
                        ? 'border-neutral-600 bg-neutral-900 text-[#f0efe9]'
                        : 'border-neutral-200/60 bg-white text-[#1c1b18]'
                    )}
                    aria-label="Suivant"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
