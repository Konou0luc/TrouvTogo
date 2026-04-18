'use client'

import { useSyncExternalStore } from 'react'

/**
 * true quand window >= minWidth (px). Côté serveur / hydratation : false pour éviter le mismatch.
 */
export function useMinWidth(minWidth: number) {
  const query = `(min-width: ${minWidth}px)`
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onStoreChange)
      return () => mq.removeEventListener('change', onStoreChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}
