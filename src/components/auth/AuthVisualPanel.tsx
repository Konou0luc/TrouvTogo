'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type AuthSlide = {
  src: string
  alt: string
  title: string
  subtitle: string
}

const DEFAULT_SLIDES: AuthSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1695643875095-f5620748605d?w=1200&q=80',
    alt: 'Marché animé en Afrique',
    title: 'Une communauté qui s’entraide',
    subtitle: 'Chaque signalement rapproche un objet de son propriétaire.',
  },
  {
    src: 'https://images.unsplash.com/photo-1765584829997-12ab011bb5b3?w=1200&q=80',
    alt: 'Vie de rue et petit commerce',
    title: 'Clés, téléphones, documents…',
    subtitle: 'Des correspondances intelligentes, sans bruit inutile.',
  },
  {
    src: 'https://images.unsplash.com/photo-1734255287995-7c09dbc99613?w=1200&q=80',
    alt: 'Marché en Afrique de l’Ouest',
    title: 'Restituer en toute confiance',
    subtitle: 'Messagerie intégrée et parcours guidé pour la remise en main propre.',
  },
  {
    src: 'https://images.unsplash.com/photo-1734868198180-645349d586f4?w=1200&q=80',
    alt: 'Architecture et rue à Lomé',
    title: 'Simple, rapide, citoyen',
    subtitle: 'Depuis Lomé et partout au Togo, suivez vos annonces en un coup d’œil.',
  },
]

type Props = {
  slides?: AuthSlide[]
}

export function AuthVisualPanel({ slides = DEFAULT_SLIDES }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [slides.length])

  const go = (delta: number) => {
    setIndex((i) => (i + delta + slides.length) % slides.length)
  }

  return (
    <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-56 lg:h-full lg:min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].src}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            className="object-cover"
            sizes="50vw"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-primary-dark/55 to-primary/35" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10 xl:p-14">
        <motion.div
          key={slides[index].title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-lg"
        >
          <p className="font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
            {slides[index].title}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/85 sm:mt-3 sm:text-sm">
            {slides[index].subtitle}
          </p>
        </motion.div>

        <div className="mt-6 flex items-center justify-between gap-4 lg:mt-10">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-card' : 'w-2 bg-card/35 hover:bg-card/55'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/25 bg-card/10 text-white backdrop-blur-md transition hover:bg-card/20"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/25 bg-card/10 text-white backdrop-blur-md transition hover:bg-card/20"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
