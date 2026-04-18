'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AuthVisualPanel, type AuthSlide } from './AuthVisualPanel'

type Props = {
  children: React.ReactNode
  slides?: AuthSlide[]
}

export function AuthPageShell({ children, slides }: Props) {
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(24,95,165,0.08),transparent_55%),radial-gradient(700px_circle_at_90%_30%,rgba(12,68,124,0.06),transparent_50%)]" />

      <div className="relative z-[1] grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-2 lg:grid-rows-1">
        <AuthVisualPanel slides={slides} />

        <div className="flex min-h-0 flex-col overflow-y-auto overscroll-contain px-4 py-5 sm:px-10 lg:justify-center lg:px-14 lg:py-6 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-xl lg:max-w-2xl"
          >
            <Link
              href="/"
              className="mb-4 block text-neutral-900 transition hover:opacity-80 dark:text-white sm:mb-5"
            >
              <span className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                Trouv<span className="text-primary">Togo</span>
              </span>
            </Link>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
