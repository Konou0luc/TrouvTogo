"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getToken } from "@/lib/auth"

type Props = {
  children: React.ReactNode
}

/**
 * Redirige vers /login si l'utilisateur n'est pas connecté.
 * Après connexion, la page demandée est restaurée via ?redirect=
 */
export function RequireAuth({ children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!getToken()) {
      const next = encodeURIComponent(pathname || "/declarer")
      router.replace(`/login?redirect=${next}`)
      return
    }
    setReady(true)
  }, [router, pathname])

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Vérification de la session…
      </div>
    )
  }

  return <>{children}</>
}
